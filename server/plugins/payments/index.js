'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const Boom = require('boom');
const braintree = require('braintree');
const Promise = require('bluebird');
const isObject = require('lodash.isobject');
const HelperService = require('../../helpers.service');


let internals = {};

internals.braintreeGateway = null;

internals.schema = Joi.object().keys({
    isSandbox: Joi.boolean(),
    merchantId: Joi.string().alphanum(),
    publicKey: Joi.string().alphanum(),
    privateKey: Joi.string().alphanum()
});

internals.defaults = {
    isSandbox: true
};

internals.withRelated = [
    'shoppingCart.cart_items.product'
];


internals.after = function (server, next) {

    /**
     * From Braintree docs:
     * "A client token is a signed data blob that includes configuration and authorization information
     * required by the Braintree Client SDK. These should not be reused; a new client token should be
     * generated for each customer request that's sent to Braintree.
     * For security, we will revoke client tokens if they are reused excessively within a short time period."
     *
     * https://developers.braintreepayments.com/start/overview
     * https://developers.braintreepayments.com/reference/request/client-token/generate/node
     *
     * @returns {Promise}
     */
    internals.getClientToken = () => {
        return new Promise((resolve, reject) => {
            internals.braintreeGateway.clientToken.generate({}, (err, response) => {
                if(err || !response.clientToken) {
                    return reject(err);
                }

                return resolve(response.clientToken);
            });
        });
    };


    /**
     * Persists some of the Braintree transaction data
     *
     * Since the Braintree API allows searching for transaction data (https://developers.braintreepayments.com/reference/general/searching/search-fields/node)
     * it seems redundant and perhaps a bit insecure to store the entire transaction JSON here as well.
     * Therefore, pulling out only a few relevant transaction attributes (most importantly the transaction id)
     * and persisting those only.
     *
     * @param cart_id
     * @param transactionJson
     * @returns {Promise}
     */
    internals.savePayment = (cart_id, transactionJson) => {
        return new Promise((resolve, reject) => {
            if(!isObject(transactionJson) || !isObject(transactionJson.transaction)) {
                let msg = 'An error occurred while processing the transaction: transactionJson.transaction is not an object';
                global.logger.error(msg);
                global.bugsnag(msg);
                return reject('An error occurred while processing the transaction.');
            }

            server.plugins.BookshelfOrm.bookshelf.model('Payment').forge()
                .save({
                    cart_id: cart_id,
                    transaction_id: transactionJson.transaction.id,  
                    transaction: transactionJson.transaction,
                    success: transactionJson.success || null
                }, {method: 'insert'})
                .then((Payment) => {
                    resolve(Payment.toJSON());
                })
                .catch((err) => {
                    global.logger.error(err);
                    global.bugsnag(err);
                    reject(err);
                });
        });
    };


    /**
     * Submits a payment 'sale' to Braintree
     *
     * @param opts  Options object to pass to braintree.transaction.sale
     * @returns {Promise}
     */
    internals.runPayment = (opts) => {
        return new Promise((resolve, reject) => {
            let schema = Joi.object().keys({
                paymentMethodNonce: Joi.string().trim().required(),
                amount: Joi.number().precision(2).positive().required(),
                shipping: Joi.object().unknown().required(),
                customer: Joi.object().unknown(),
                billing: Joi.object().unknown(),
                options: Joi.object().unknown()
            });

            const validateResult = schema.validate(opts);
            if (validateResult.error) {
                return reject(validateResult.error);
            }

            internals.braintreeGateway.transaction.sale(opts)
                .then((result) => {
                    if (result.success) {
                        return resolve(result);
                    }

                    throw new Error(result.message);
                })
                .catch((err) => {
                    // NOTE: this error will be logged by the calling function
                    let msg = err instanceof Error ? err.message : err;
                    return reject(msg);
                });
        });
    };


    /************************************
     * ROUTE HANDLERS
     ************************************/

    internals.getOrder = (request, reply) => {
        server.plugins.BookshelfOrm.bookshelf.model('Payment').getPaymentByAttribute('transaction_id', request.query.transaction_id)
            .then((payment) => {
                if(!payment) {
                    return reply(Boom.notFound('Order not found'));
                }

                let p = payment.toJSON();

                // Much less data can be sent over the wire in this case, 
                // so trimming the transaction value in the response
                let cartResponse = request.query.verbose 
                                    ? p.shoppingCart 
                                    : { num_items: p.shoppingCart.num_items, shipping_email: p.shoppingCart.shipping_email };

                let response = {
                    id: p.id,
                    created: p.created_at,
                    shipping: p.transaction.shipping,
                    shoppingCart: cartResponse,
                    transaction: {
                        id: p.transaction_id,
                        amount: p.transaction.amount,
                        payment: {
                            type: p.transaction.paymentInstrumentType
                        }
                    }
                };

                if(p.transaction.paymentInstrumentType === 'credit_card') {
                    response.transaction.payment.last4 = p.transaction.creditCard.last4;
                    response.transaction.payment.cardType = p.transaction.creditCard.cardType;
                }
                else {
                    response.transaction.payment.payerEmail = p.transaction.paypalAccount.payerEmail;
                }
                
                reply.apiSuccess(response);
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.getOrders = (request, reply) => {
        HelperService
            .fetchPage(request, server.plugins.BookshelfOrm.bookshelf.model('Payment'), internals.withRelated)
            .then((orders) => {
                reply.apiSuccess(orders, orders.pagination);
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.notFound(err));
            });
    };


    server.route([
        {
            method: 'GET',
            path: '/order',
            config: {
                description: 'Basic order info',
                validate: {
                    query: {
                        transaction_id: Joi.string().max(50),
                        verbose: Joi.boolean().optional()
                    }
                },
                handler: internals.getOrder
            }
        },
        {
            method: 'GET',
            path: '/orders',
            config: {
                description: 'Gets a list of orders',
                handler: internals.getOrders
            }
        }
    ]);


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'Payment',
        require('./models/Payment')(baseModel, bookshelf, server)
    );


    server.expose('getClientToken', internals.getClientToken);
    server.expose('runPayment', internals.runPayment);
    server.expose('savePayment', internals.savePayment);

    return next();
};



exports.register = (server, options, next) => {
    const validateOptions = internals.schema.validate(options);
    if (validateOptions.error) {
        return next(validateOptions.error);
    }

    const settings = Hoek.applyToDefaults(internals.defaults, options);

    internals.braintreeGateway = braintree.connect({
        environment: settings.isSandbox ? braintree.Environment.Sandbox : braintree.Environment.Production,
        merchantId: settings.merchantId,
        publicKey: settings.publicKey,
        privateKey: settings.privateKey
    });

    server.dependency(['BookshelfOrm'], internals.after);

    return next();
};

exports.register.attributes = require('./package.json');