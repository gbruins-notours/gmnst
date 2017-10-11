'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const HelperService = require('../../helpers.service');
const forEach = require('lodash.foreach');
const isObject = require('lodash.isobject');
const isString = require('lodash.isstring');
const cloneDeep = require('lodash.clonedeep');
const jwt = require('jsonwebtoken');

let internals = {};


internals.shippingAttributes = {
    shipping_firstName: Joi.string().trim().max(255).required(),
    shipping_lastName: Joi.string().trim().max(255).required(),
    shipping_company: Joi.string().trim().max(255).empty(null),
    shipping_streetAddress: Joi.string().trim().max(255).required(),
    shipping_extendedAddress: Joi.string().trim().max(255).empty(null),
    shipping_city: Joi.string().trim().max(255).required(),
    shipping_state: Joi.string().trim().max(255).required(),
    shipping_postalCode: Joi.string().trim().max(10).required(),
    shipping_countryCodeAlpha2: Joi.string().trim().max(2).required(),  // alpha2 is required by PayPal:  https://developers.braintreepayments.com/reference/request/transaction/sale/node#billing.country_code_alpha2
    shipping_email: Joi.string().email().max(50).label('Shipping: Email').required()
}

internals.billingAttributes = {
    billing_firstName: Joi.string().trim().max(255),
    billing_lastName: Joi.string().trim().max(255),
    billing_company: Joi.string().trim().max(255).empty(null),
    billing_streetAddress: Joi.string().trim().max(255),
    billing_extendedAddress: Joi.string().trim().max(255).empty(null),
    billing_city: Joi.string().trim().max(255),
    billing_state: Joi.string().trim().max(255),
    billing_postalCode: Joi.string().trim().max(10),
    billing_countryCodeAlpha2: Joi.string().trim().max(2),
    billing_phone: Joi.string().trim().max(30).empty(null)
}


/**
 * Joi definitions for the ShoppingCart model
 *
 * NOTE:
 * The 'max' values are based on what is accepted by Braintree:
 * https://developers.braintreepayments.com/reference/request/transaction/sale/node
 */
internals.schema = Joi.object().keys({
    token: Joi.string().trim().max(100).required(),
    billing: Joi.object().keys(internals.billingAttributes),
    shipping: Joi.object().keys(internals.shippingAttributes)
});



internals.after = function (server, next) {

    internals.ShoppingCartModel = server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart');


    // internals.withRelated = [
    //     {
    //         cart_items: (query) => {
    //             query.orderBy('created_at', 'DESC');
    //         }
    //     }
    // ];

    internals.shoppingCart = {};


    internals.shoppingCart.findOrCreate = (request) => {
        return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart').findOrCreateCart(request);
    };

    internals.shoppingCart.get = (request) => {
        return new Promise((resolve, reject) => {
            server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart').getCart(request)
                .then((ShoppingCart) => {
                    if (!ShoppingCart) {
                        return reject('Unable to find a shopping cart for the given token.');
                    }

                    resolve(ShoppingCart);
                });
        });
    };


    internals.shoppingCartItem = {};


    /**
     * Adds a product to the shopping cart using the HTTP request data
     *
     * @returns {Promise}
     */
    internals.shoppingCartItem.add = (request) => {
        return new Promise((resolve, reject) => {
            Promise
                .all([
                    server.plugins.Products.getProductByAttribute('id', request.payload.id),
                    internals.shoppingCart.findOrCreate(request)
                ])
                .then((results) => {
                    let Product = results[0];
                    let ShoppingCart = results[1];

                    let qty = request.payload.options.qty || 1;
                    let shoppingCartId = ShoppingCart.get('id');
                    let productId = Product.get('id');

                    // Shopping Cart doesn't have any items yet.
                    // Create a new cart item
                    if(Object.keys(ShoppingCart.relations).length === 0) {
                        return createCartItem();
                    }
                    // Determine if we simply need to update the qty of an existing item
                    // or add a new one
                    else {
                        return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
                            .findByVariant(shoppingCartId, productId, 'size', request.payload.options.size)
                            .then((ShoppingCartItem) => {
                                // No matching variants.
                                // Create a new cart item
                                if(!ShoppingCartItem) {
                                    return createCartItem();
                                }
                                else {
                                    // Item with matching variants is already in the cart.
                                    // Just need to update the qty
                                    return ShoppingCartItem.save(
                                        { qty: parseInt(ShoppingCartItem.get('qty') + qty, 10) },
                                        { method: 'update', patch: true }
                                    );
                                }
                            });
                    }

                    // NOTE: knex.js requires use of JSON.stringify() for json values
                    // http://knexjs.org/#Schema-json
                    function createCartItem() {
                        return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
                            .create({
                                qty: qty,
                                variants: JSON.stringify({
                                    size: request.payload.options.size
                                }),
                                cart_id: shoppingCartId,
                                product_id: productId
                            });
                    }
                })
                .then(resolve)
                .catch((err) => {
                    global.appInsightsClient.trackException({
                        exception: err
                    });
                    reject(err);
                });
        });
    };


    internals.shoppingCartItem.get = (id) => {
        return new Promise((resolve, reject) => {
            server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
                .findById(id)
                .then((ShoppingCartItem) => {
                    if(!ShoppingCartItem) {
                        return reject('Unable to find a shopping cart item.');
                    }

                    resolve(ShoppingCartItem);
                });
        });
    };


    /**
     * Removes an item from the cart
     *
     * @param request
     * @returns {Promise<U>|*|Promise.<TResult>}
     */
    internals.shoppingCartItem.remove = (request) => {
        return internals.shoppingCartItem
            .get(request.payload.id)
            .then((ShoppingCartItem) => {
                if(!ShoppingCartItem) {
                    return;
                }

                return ShoppingCartItem.destroy();
            });
    };


    /**
     * Updates the qty value of a cart item
     *
     * @param request
     * @returns {Promise<U>|*|Promise.<TResult>}
     */
    internals.shoppingCartItem.updateQty = (request) => {
        return internals.shoppingCartItem
            .get(request, request.payload.id)
            .then((ShoppingCartItem) => {
                if(!ShoppingCartItem) {
                    return;
                }

                return ShoppingCartItem.save(
                    { qty: parseInt((ShoppingCartItem.get('qty') + request.payload.qty), 10) },
                    { method: 'update', patch: true }
                );
            });
    };


    server.route([
        {
            method: 'GET',
            path: '/cart/token/get',
            config: {
                description: 'Returns the Braintree client token',
                handler: (request, reply) => {
                    server.plugins['Payments'].getClientToken()
                        .then((token) => {
                            reply.apiSuccess(token);
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'GET',
            path: '/cart/get',
            config: {
                description: 'Finds the cart for the given jwt user',
                // auth: {
                //     strategy: 'jwt'
                // },
                handler: (request, reply) => {
                    internals.shoppingCart.findOrCreate(request)
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart.toJSON());
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });

                            HelperService.getBoomError(err, (error, result) => {
                                reply(result);
                            });
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/addresses',
            config: {
                description: 'Finds the cart for the given jwt user',
                validate: {
                    payload: Joi.object({
                        id: Joi.string().uuid().required()
                    })
                },
                handler: (request, reply) => {
                    internals.shoppingCart.findOrCreate(request)
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart.toJSON());
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });

                            HelperService.getBoomError(err, (error, result) => {
                                reply(result);
                            });
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/item/add',
            config: {
                description: 'Adds a new item to the cart',
                validate: {
                    payload: Joi.object({
                        id: Joi.string().uuid().required(),
                        options: Joi.object({
                            size: Joi.string().uppercase().min(6), // 'SIZE_?'
                            qty: Joi.number().min(1).required()
                        }).required()
                    })
                },
                handler: (request, reply) => {
                    internals.shoppingCartItem
                        .add(request)
                        .then(() => {
                            return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart').getCart(request);
                        })
                        .then((ShoppingCart) => {
                            // reply.apiSuccess(ShoppingCart);
                            reply.apiSuccess(ShoppingCart.toJSON());
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/item/remove',
            config: {
                description: 'Removes an item from the cart',
                validate: {
                    payload: {
                        id: Joi.string().uuid().required()
                    }
                },
                handler: (request, reply) => {
                    internals.shoppingCart.get(request)
                        .then((ShoppingCart) => {
                            return internals.shoppingCartItem.remove(request);
                        })
                        .then(() => {
                            return internals.shoppingCart.get(request);
                        })
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart.toJSON());
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/item/qty',
            config: {
                description: 'Updates the quantity of a shopping cart item (ShoppingCartItem model)',
                validate: {
                    payload: Joi.object({
                        id: Joi.string().uuid().required(),  // cart item id
                        qty: Joi.number().min(1).required()
                    })
                },
                handler: (request, reply) => {
                    internals.shoppingCart.get(request)
                        .then((ShoppingCart) => {
                            return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
                                .findById(request.payload.id)
                                .then((ShoppingCartItem) => {
                                    if(!ShoppingCartItem) {
                                        throw new Error(`Unable to find a shopping cart item.`);
                                    }

                                    return ShoppingCartItem.save(
                                        { qty: parseInt((request.payload.qty || 1), 10) },
                                        { method: 'update', patch: true }
                                    );
                                })
                                .then(() => {
                                    return internals.shoppingCart.get(request)
                                })
                                .then((ShoppingCart) => {
                                    reply.apiSuccess(ShoppingCart.toJSON());
                                });
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/shipping/setaddress',
            config: {
                description: 'Sets the shipping address for the cart and calculates the sales tax',
                validate: {
                    payload: Joi.reach(internals.schema, 'shipping')
                },
                handler: (request, reply) => {
                    internals.shoppingCart.get(request)
                        .then((ShoppingCart) => {
                            let salesTaxParams = cloneDeep(request.payload);
                            salesTaxParams.sub_total = ShoppingCart.sub_total

                            return server.plugins['SalesTax'].getSalesTaxAmount(salesTaxParams).then((salesTax) => {
                                // Save the shipping params and the sales tax value in the model
                                let updateParams = request.payload;
                                updateParams.sales_tax = salesTax;

                                return ShoppingCart.save(
                                    updateParams,
                                    { method: 'update', patch: true }
                                );
                            });
                        })
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart.toJSON());
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/checkout',
            config: {
                description: 'Braintree nonce received by the client. Complete the transaction',
                validate: {
                    // NOTE: shipping is not required here because the 'cart/shipping/setaddress' route
                    // should have been called before this route, which persists the shipping info.
                    payload: Object.assign(
                        {}, 
                        { nonce: Joi.string().trim().required() }, 
                        internals.billingAttributes
                    )
                },
                handler: (request, reply) => {
                    let cartJson;
                    let cart;

                    internals.shoppingCart.get(request)
                        .then((ShoppingCart) => {
                            cart = ShoppingCart;
                            cartJson = ShoppingCart.toJSON();

                            return server.plugins.Payments.runPayment({
                                paymentMethodNonce: request.payload.nonce,
                                amount: ShoppingCart.get('grand_total'),
                                customer: {
                                    // NOTE: Braintree requires that this email has a '.' in the domain name (i.e test@test.com)
                                    // which technically isn't correct. This fails validation: test@test
                                    email: cartJson.shipping_email
                                },
                                shipping: {
                                    company: cartJson.shipping_company,
                                    countryCodeAlpha2: cartJson.shipping_countryCodeAlpha2,
                                    extendedAddress: cartJson.shipping_extendedAddress || null,
                                    firstName: cartJson.shipping_firstName,
                                    lastName: cartJson.shipping_lastName,
                                    locality: cartJson.shipping_city,
                                    postalCode: cartJson.shipping_postalCode,
                                    region: cartJson.shipping_state,
                                    streetAddress: cartJson.shipping_streetAddress
                                },
                                billing: {
                                    company: request.payload.billing_company,
                                    countryCodeAlpha2: request.payload.billing_countryCodeAlpha2,
                                    extendedAddress: request.payload.billing_extendedAddress || null,
                                    firstName: request.payload.billing_firstName,
                                    lastName: request.payload.billing_lastName,
                                    locality: request.payload.billing_city,
                                    postalCode: request.payload.billing_postalCode,
                                    region: request.payload.billing_state,
                                    streetAddress: request.payload.billing_streetAddress
                                },
                                options: {
                                    submitForSettlement: true
                                }
                            });
                        })
                        .then((transactionObj) => {
                            console.log('BRAINTREE TRANSACTION RESULT', transactionObj)

                            //TODO: appEvents is undefined
                            // request.server.appEvents.emit('gmnst-payment-success', cart);

                            // If the Braintree transaction is successful then anything that happens after this
                            // (i.e saving the payment details to DB) needs to fail silently, as the user has
                            // already been changed and we can't give the impression of an overall transaction
                            // failure that may prompt them to re-do the purchase.

                            // Saving the payment transaction whether it was successful (transactionObj.success === true)
                            // or not (transactionObj.success === false)
                            // Any failures that happen while saving the payment info do not affect the
                            // braintree transaction and thus should fail silently.
                            server.plugins.Payments
                                .savePayment(cartJson.id, transactionObj)
                                .catch((err) => {
                                    // Catching the error here and not letting it fall through 
                                    // to the catch block below because we do not want this 
                                    // failure returning in the API response.  It will be logged only.
                                    global.logger.error(`ERROR SAVING PAYMENT INFO: ${err}`)
                                    global.appInsightsClient.trackException({
                                        exception: err
                                    });
                                });


                            // Updating the cart with the billing params and the 'closed_at' 
                            // timestamp if transaction was successful:
                            let updateParams = cloneDeep(request.payload);
                            delete updateParams.nonce;
                            if(transactionObj.success) {
                                // This will cause the cart not to be re-used
                                // (See ShoppingCart -> getCart())
                                updateParams.closed_at = new Date() 
                            }

                            cart.save(
                                updateParams,
                                { method: 'update', patch: true }
                            )
                            .catch((err) => {
                                global.logger.error(err);
                                global.appInsightsClient.trackException({
                                    exception: err
                                });
                            });


                            // Successful transactions return the transaction id
                            if(transactionObj.success) {
                                reply.apiSuccess({
                                    transactionId: transactionObj.transaction.id
                                });
                            }
                            else {
                                throw new Error(transactionObj.message || 'An error occurred when saving the payment transaction data.')
                            }
                        })
                        .catch((err) => {
                            global.logger.error(err)
                            global.appInsightsClient.trackException({
                                exception: err
                                // exception: new Error(msg)
                            });
                            
                            HelperService.getBoomError(err, (error, result) => {
                                reply(result);
                            });
                        });
                }
            }
        },
        {
            method: 'GET',
            path: '/cart/{param*}',
            config: {
                description: 'Returns 404 response',
                handler: (request, reply) => {
                    reply(Boom.notFound());
                }
            }
        }
    ]);


    server.expose('schema', internals.schema);
    server.expose('findOrCreate', internals.shoppingCart.findOrCreate);


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    // let baseModel = bookshelf.Model.extend({});
    let baseModel = require('bookshelf-modelbase')(bookshelf);

    let ShoppingCart = require('./models/ShoppingCart')(baseModel, bookshelf, server);
    let ShoppingCartItem = require('./models/ShoppingCartItem')(baseModel, bookshelf, server);

    bookshelf.model('ShoppingCart', ShoppingCart);
    bookshelf.model('ShoppingCartItem', ShoppingCartItem);
    bookshelf.collection('ShoppingCarts', require('./models/ShoppingCarts')(bookshelf, ShoppingCart));
    bookshelf.collection('ShoppingCartItems', require('./models/ShoppingCartItems')(bookshelf, ShoppingCartItem));


    return next();
};



exports.register = (server, options, next) => {
    server.dependency(['BookshelfOrm', 'Core', 'Products', 'Payments', 'SalesTax'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
