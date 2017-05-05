const Joi = require('joi');
const Hoek = require('hoek');
const Boom = require('boom');
const braintree = require('braintree');
const Promise = require('bluebird');
const isObject = require('lodash.isobject');
const forEach = require('lodash.foreach');


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
        let p = new Promise( (resolve, reject) => {
            internals
                .braintreeGateway
                .clientToken
                .generate(
                    {},
                    (err, response) => {
                        if(err || !response.clientToken) {
                            return reject(err);
                        }

                        return resolve(response.clientToken);
                    }
                );
        });

        return p;
    };


    /**
     * Creates a transaction in Braintree
     * The returned Promise is resolved with the transaction JSON data returned from Braintree
     *
     * @param {opts}
     * @returns {Promise}
     */
    internals.makeBraintreeSale = (opts) => {
        let p = new Promise( (resolve, reject) => {

            let schema = Joi.object().keys({
                paymentMethodNonce: Joi.string().trim().required(),
                amount: Joi.number().precision(2).positive().required(),
                shipping: Joi.object().unknown().required(),
                customer: Joi.object().unknown(),
                billing: Joi.object().unknown(),
                options: Joi.object().unknown()
            });

            let saleOptions = {
                paymentMethodNonce: opts.nonce,
                amount: opts.amount,
                shipping: opts.shipping,
                customer: opts.customer,
                billing: opts.billing,
                options: opts.options || { submitForSettlement: true }
            };

            const validateOptions = schema.validate(saleOptions);
            if (validateOptions.error) {
                // console.log("MAKE SALE", opts.amount);
                reject( Boom.badData(validateOptions.error) );
                return;
            }

            internals
                .braintreeGateway
                .transaction
                .sale(saleOptions, (err, transactionJson) => {
                    if(err) {
                        return reject(err);
                    }

                    return resolve(transactionJson);
                });
        });

        return p;
    };


    /**
     * Persists some of the Braintree transaction data
     *
     * Since the Braintree API allows searching for transaction data (https://developers.braintreepayments.com/reference/general/searching/search-fields/node)
     * it seems redundant and perhaps a bit insecure to store the entire transaction JSON here as well.
     * Therefore, pulling out only a few relevant transaction attributes (most importantly the transaction id)
     * and persisting those only.
     *
     * @param request
     * @param cart_id
     * @param transactionJson
     * @returns {Promise}
     */
    internals.savePayment = (request, cart_id, transactionJson) => {
        let p = new Promise( (resolve, reject) => {

            if(!isObject(transactionJson) || !isObject(transactionJson.transaction)) {
                reject('An error occurred while processing the transaction.');
                return;
            }

            let paymentSchema = Joi.object().keys({
                cart_id: Joi.number().integer().min(1).required(),
                transaction_id: Joi.string().required(),
                processor_response_code: Joi.string().allow(''), // Allow empty strings
                amount: Joi.number().precision(2),
                payment_type: Joi.string().allow(''),
                currency_iso_code: Joi.string().allow(''),
                success: Joi.boolean()
            });

            let paymentOptions = {
                cart_id: cart_id,
                transaction_id: transactionJson.transaction.id,
                processor_response_code: transactionJson.transaction.processorResponseCode,
                amount: transactionJson.transaction.amount,
                payment_type: transactionJson.transaction.paymentInstrumentType,
                currency_iso_code: transactionJson.transaction.currencyIsoCode,
                success: transactionJson.success
            };

            const validateOptions = paymentSchema.validate(paymentOptions);
            if (validateOptions.error) {
                reject( Boom.badData(validateOptions.error) );
                return;
            }

            let Payment = server.plugins.BookshelfOrm.bookshelf.model('Payment');

            // let args = {};
            // _.forEach(paymentOptions, (val, key) => {
            //     args[key] = val;
            // });

            Payment
                .forge()
                .save(
                    paymentOptions,
                    { method: 'insert'}
                )
                .then(
                    (Payment) => {
                        resolve(Payment);
                    }
                )
                .catch(
                    (err) => {
                        reject(err);
                    }
                );
        });

        return p;
    };


    /**
     * Submits a payment 'sale' to Braintree
     *
     * 1) Get the current shopping cart from the session
     * 2) Set shipping and billing data and save the cart
     * 3) Make the sale in Braintree
     *
     * @param ShoppingCart  The ShoppingCart model
     * @param request
     *
     * @returns {Promise}
     */
    internals.runPayment = (ShoppingCart, request) => {
        let p = new Promise( (resolve, reject) => {
            let cartUpdateData = {};

            let opts = {};
            opts.nonce = request.payload.nonce;
            opts.amount = ShoppingCart.get('grand_total');
            opts.shipping = {
                company: request.payload.shipping.company,
                countryCodeAlpha2: request.payload.shipping.countryCodeAlpha2,
                extendedAddress: request.payload.shipping.extendedAddress,
                firstName: request.payload.shipping.firstName,
                lastName: request.payload.shipping.lastName,
                locality: request.payload.shipping.city,
                postalCode: request.payload.shipping.postalCode,
                region: request.payload.shipping.state,
                streetAddress: request.payload.shipping.streetAddress
            };
            opts.billing = {
                company: request.payload.billing.company,
                countryCodeAlpha2: request.payload.billing.countryCodeAlpha2,
                extendedAddress: request.payload.billing.extendedAddress,
                firstName: request.payload.billing.firstName,
                lastName: request.payload.billing.lastName,
                locality: request.payload.billing.city,
                postalCode: request.payload.billing.postalCode,
                region: request.payload.billing.state,
                streetAddress: request.payload.billing.streetAddress
            };
            opts.options = {
                submitForSettlement: true
            };
            opts.customer = {
                // NOTE: Braintree requires that this email has a '.' in the domain name (i.e test@test.com)
                // which technically isn't correct. This fails validation: test@test
                email: request.payload.shipping.email
            };

            /*
             * If the Braintree transaction is successful then anything that happens after this
             * (i.e saving the payment details to DB) needs to fail silently, as the user has
             * already been changed and we can't give the impression of an overall transaction
             * failure that may prompt them to re-do the purchase.
             */
            internals
                .makeBraintreeSale(opts)
                .then(
                    (transactionJson) => {
                        let genericErrorMsg = 'An error occurred when creating the transaction.';

                        if (!isObject(transactionJson)) {
                            request.server.log(['error', 'braintree'], genericErrorMsg);
                            reject(
                                Boom.badData(genericErrorMsg)
                            );
                            return;
                        }

                        cartUpdateData.status = transactionJson.success
                            ? server.plugins.ShoppingCart.STATUS_PAYMENT_SUCCESS
                            : server.plugins.ShoppingCart.STATUS_PAYMENT_FAILED;

                        /*
                         * Saving the payment transaction whether it was successful (transactionJson.success === true)
                         * or not (transactionJson.success === false)
                         *
                         * Any failures that happen while saving the payment info do not affect the
                         * braintree transaction and thus should fail silently.
                         */
                        internals
                            .savePayment(
                                request,
                                ShoppingCart.get('id'),
                                transactionJson
                            )
                            .catch(
                                (err) => {
                                    request.server.log(['error', 'payment'], 'ERROR SAVING PAYMENT INFO: ' + err);
                                }
                            )
                            .finally(
                                () => {
                                    if (transactionJson.success) {
                                        resolve(ShoppingCart);
                                    }
                                    else {
                                        let error = transactionJson.message || genericErrorMsg;
                                        request.server.log(['error', 'payment'], error);
                                        reject(Boom.badData(error));
                                    }
                                }
                            );
                    }
                )
                .catch(
                    (err) => {
                        cartUpdateData.status = server.plugins.ShoppingCart.STATUS_PAYMENT_FAILED;
                        request.server.log(['info', 'braintree'], err);
                        reject(err);
                    }
                )
                .finally(
                    () => {
                        // shipping
                        forEach(request.payload.shipping, (val, key) => {
                            cartUpdateData['shipping_' + key] = val;
                        });

                        // billing
                        forEach(request.payload.billing, (val, key) => {
                            cartUpdateData['billing_' + key] = val;
                        });

                        return ShoppingCart.save(
                            cartUpdateData,
                            { method: 'update', patch: true }
                        );
                    }
                ) ;
        });

        return p;
    };


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'Payment',
        require('./models/Payment')(baseModel, bookshelf, server)
    );


    server.expose('getClientToken', internals.getClientToken);
    server.expose('runPayment', internals.runPayment);

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