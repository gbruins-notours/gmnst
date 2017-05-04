'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const winston = require('winston');
const HelperService = require('../../helpers.service');


let internals = {};


/**
 * Joi definitions for the ShoppingCart model
 *
 * NOTE:
 * The 'max' values are based on what is accepted by Braintree:
 * https://developers.braintreepayments.com/reference/request/transaction/sale/node
 */
internals.schema = Joi.object().keys({
    sid: Joi.string().trim().max(100).required(),
    cart_data: Joi.string().required(),

    billing: Joi.object().keys({
        firstName: Joi.string().trim().max(255),
        lastName: Joi.string().trim().max(255),
        company: Joi.string().trim().max(255),
        streetAddress: Joi.string().trim().max(255),
        extendedAddress: Joi.string().trim().max(255),
        city: Joi.string().trim().max(255),
        state: Joi.string().trim().max(255),
        postalCode: Joi.string().trim().max(10),
        countryCodeAlpha2: Joi.string().trim().max(2),
        phone: Joi.string().trim().max(30)
    }),

    shipping: Joi.object().keys({
        firstName: Joi.string().trim().max(255).required(),
        lastName: Joi.string().trim().max(255).required(),
        company: Joi.string().trim().max(255),
        streetAddress: Joi.string().trim().max(255).required(),
        extendedAddress: Joi.string().trim().max(255),
        city: Joi.string().trim().max(255).required(),
        state: Joi.string().trim().max(255).required(),
        postalCode: Joi.string().trim().max(10).required(),
        countryCodeAlpha2: Joi.string().trim().max(2).required(),  // alpha2 is required by PayPal:  https://developers.braintreepayments.com/reference/request/transaction/sale/node#billing.country_code_alpha2
        email: Joi.string().email().max(50).label('Shipping: Email').required()
    })
});



internals.after = function (server, next) {

    internals.SALES_TAX_RATE = .0875;
    internals.STATUS_PAYMENT_SUCCESS = 'payment_success';
    internals.STATUS_PAYMENT_FAILED = 'payment_failed';

    internals.cartItemExists = (cart_data, product) => {
        let existingItemKey = null;

        if(_.isArray(cart_data) && product) {
            _.forEach(cart_data, (cartItem, key) => {
                if(_.isObject(cartItem.product)
                    && cartItem.product.id === product.id
                    && _.isEqual(cartItem.product.__selectedOptions, product.__selectedOptions)) {
                    existingItemKey = key;
                    return false;  // breaks out of forEach loop
                }
            });
        }

        return existingItemKey;
    };


    /**
     * Finds the cart for the current session,
     * or creates one if it doesn't exist
     *
     * @param request
     * @returns {Promise}
     */
    internals.findOrCreateSessionCart = (request) => {
        let p = new Promise( (resolve, reject) => {

            // TODO: no more yar
            let requestSchema = Joi.object({
                yar: Joi.object({
                    id: Joi.string().required()
                }).unknown()
            }).unknown();

            let requestValidation = Joi.validate(request, requestSchema);
            if(requestValidation.error) {
                reject(requestValidation.error);
                return;
            }

            let ShoppingCart = server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart');

            ShoppingCart
                .forge({
                    sid: request.yar.id // TODO: no more yar
                })
                .fetch()
                .then(
                    (ShoppingCartModel) => {
                        if(ShoppingCartModel) {
                            resolve(ShoppingCartModel);
                        }
                        else {
                            ShoppingCart
                                .forge()
                                .save('sid', request.yar.id) // TODO: no more yar
                                .then(
                                    (model) => {
                                        resolve(model);
                                    }
                                );
                        }
                    }
                )
                .catch(
                    (err) => {
                        reject(err);
                    }
                );
            }
        );

        return p;
    };


    /**
     * Returns the total number of items in the cart
     *
     * @param cartData
     * @returns {number}
     */
    internals.getNumItemsInCart = (cartData) => {
        let num = 0;

        if(_.isString(cartData)) {
            try {
                cartData = JSON.parse(cartData);
            }
            catch(err) {
                cartData = null;
            }
        }

        var cartDataSchema = Joi.array().items(
            Joi.object({
                qty: Joi.number()
            }).unknown().required()
        ).required();

        if(!Joi.validate(cartData, cartDataSchema).error) {
            _.forEach(cartData, (cartItem) => {
                // NOTE:
                // It's best to use _.isFinite() here rather than _.isNumber() in case cartItem.qty is NaN
                // Technically, I guess NaN is a number:
                // https://github.com/jashkenas/underscore/issues/406
                if(_.isFinite(cartItem.qty)) {
                    num += cartItem.qty;
                }
            });
        }

        return num;
    };


    internals.getCartItemPrice = (cartItem) => {
        let price = 0;

        let cartItemSchema = Joi.object({
            product: Joi.object({
                is_on_sale: Joi.boolean(),
                sale_price: Joi.number().precision(2),
                base_price: Joi.number().precision(2)
            }).unknown().required()
        }).unknown();

        if(!Joi.validate(cartItem, cartItemSchema).error) {
            if(cartItem.product.is_on_sale && cartItem.product.sale_price) {
                price = cartItem.product.sale_price;
            }
            else if(cartItem.product.base_price) {
                price = cartItem.product.base_price;
            }
        }

        return parseFloat(price);
    };


    /**
     * Gets the cart item's total price for it's individual price x quantity
     *
     * @param cartItem
     * @returns {number}
     */
    internals.getCartItemTotalPrice = (cartItem) => {
        let price = internals.getCartItemPrice(cartItem);

        let cartItemSchema = Joi.object({
            qty: Joi.number().required()
        }).unknown();

        if(!Joi.validate(cartItem, cartItemSchema).error) {
            price = price * parseInt(cartItem.qty, 10);
        }

        return parseFloat( price.toFixed(2) );
    };


    internals.getCartSalesTax = (cartData) => {
        let subTotal = internals.getCartSubTotal(cartData);

        if(subTotal) {
            return parseFloat((subTotal * internals.SALES_TAX_RATE).toFixed(2));
        }

        return 0;
    };


    /**
     * Returns the sub-total for all items in the cart
     * (shipping and sales tax cost not included)
     *
     * @param cartData
     * @returns {number}
     */
    internals.getCartSubTotal = (cartData) => {
        let subtotal = 0;

        if(_.isString(cartData)) {
            try {
                cartData = JSON.parse(cartData);
            }
            catch(err) {
                cartData = null;
            }
        }

        let cartDataSchema = Joi.array().items(
            Joi.object({
                qty: Joi.number(),
                product: Joi.object().unknown()
            }).unknown().required()
        ).required();

        if(!Joi.validate(cartData, cartDataSchema).error) {
            _.forEach(cartData, (cartItem) => {
                subtotal += internals.getCartItemTotalPrice(cartItem);
            });
        }

        return parseFloat( subtotal.toFixed(2) );
    };


    internals.getCartGrandTotal = (cartData) => {
        let subTotal = internals.getCartSubTotal(cartData);
        let salesTax = internals.getCartSalesTax(cartData);

        if(subTotal) {
            return (subTotal + salesTax);
        }

        return 0;
    };


    /**
     * Adds a product to the shopping cart using the HTTP request data
     *
     * @returns {Promise}
     */
    internals.addProductToCart = (request) => {
        var p = new Promise( (resolve, reject) => {

            Promise
                .all([
                    server.plugins.Products.getProductJsonFromRequest(request),
                    internals.findOrCreateSessionCart(request)
                ])
                .then(
                    (results) => {
                        let decoratedProduct = results[0];
                        let ShoppingCart = results[1];
                        let qty = request.payload.qty || 1;

                        let cart_data = ShoppingCart.get('cart_data');
                        let existingCartItemKey = internals.cartItemExists(cart_data, decoratedProduct.product);

                        if(!_.isArray(cart_data)) {
                            cart_data = [];
                        }

                        // If this item is already in the cart then just update the qty:
                        if(existingCartItemKey !== null) {
                            if(cart_data[existingCartItemKey] && cart_data[existingCartItemKey].qty) {
                                cart_data[existingCartItemKey].qty += qty;
                            }
                        }
                        else {
                            // Item not in the cart yet, so add it
                            decoratedProduct.qty = qty;
                            cart_data.push({
                                itemId: new Date().valueOf(),
                                product: decoratedProduct
                            });
                        }

                        return ShoppingCart.save(
                            // knex.js requires use of JSON.stringify() for json values;
                            // http://knexjs.org/#Schema-json
                            { cart_data: JSON.stringify(cart_data) },
                            { method: 'update', patch: true }
                        );
                    }
                )
                .then(
                    (ShoppingCart) => {
                        resolve(ShoppingCart);
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


    internals.getModelAsJson = (ShoppingCartModel) => {
        let cartJson = ShoppingCartModel.toJSON();

        if(_.isString(cartJson.cart_data)) {
            cartJson.cart_data = JSON.parse(cartJson.cart_data);
        }

        return cartJson;
    };



    server.route([
        // {
        //     method: 'GET',
        //     path: '/cart/get',
        //     config: {
        //         description: 'Finds the cart for the given session',
        //         handler: (request, reply) => {
        //             internals
        //                 .findOrCreateSessionCart(request)
        //                 .then(
        //                     (ShoppingCart) => {
        //                         reply.apiSuccess(
        //                             internals.getModelAsJson(ShoppingCart)
        //                         );
        //                     }
        //                 )
        //                 .catch(
        //                     (err) => {
        //                         HelperService.getBoomError(err, (error, result) => {
        //                             reply(result);
        //                         });
        //                     }
        //                 );
        //         }
        //     }
        // },
        {
            method: 'GET',
            path: '/cart/get',
            config: {
                description: 'Finds the cart for the given jwt user',
                // auth: {
                //     strategy: 'jwt'
                // },
                handler: (request, reply) => {
                    internals
                        .findOrCreateSessionCart(request)
                        .then(
                            (ShoppingCart) => {
                                reply.apiSuccess(
                                    internals.getModelAsJson(ShoppingCart)
                                );
                            }
                        )
                        .catch(
                            (err) => {
                                HelperService.getBoomError(err, (error, result) => {
                                    reply(result);
                                });
                            }
                        );
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
                        product: Joi.object({
                            __selectedOptions: Joi.object({
                                size: Joi.number().min(1)
                            }).optional(),
                            id: Joi.number().min(1).required()
                        }).required(),
                        qty: Joi.number().min(1).required()
                    })
                },
                handler: (request, reply) => {
                    internals
                        .addProductToCart(request)
                        .then(
                            (ShoppingCart) => {
                                reply.apiSuccess(
                                    internals.getModelAsJson(ShoppingCart)
                                );
                            }
                        )
                        .catch(
                            (err) => {
                                winston.error(err);
                                reply(Boom.badData(err));
                            }
                        );
                }
            }
        },
        {
            method: 'DELETE',
            path: '/cart/item/remove/{id}',
            config: {
                description: 'Removes an item from the cart',
                validate: {
                    params: {
                        id: Joi.number().min(1)
                    }
                },
                handler: (request, reply) => {
                    internals
                        .findOrCreateSessionCart(request)
                        .then(
                            (ShoppingCart) => {
                                let cart_data = ShoppingCart.get('cart_data');
                                let deletedItem = null;

                                _.forEach(cart_data, (obj, key) => {
                                    if(obj.itemId == request.params.id) {
                                        deletedItem = obj.itemId;
                                        cart_data.splice(key, 1);
                                        return false;  // breaks out of forEach loop
                                    }
                                });

                                if(deletedItem === null) {
                                    throw new Error('A cart item was not found for the given key.');
                                }

                                // knex.js requires use of JSON.stringify() for json values;
                                // http://knexjs.org/#Schema-json
                                return ShoppingCart.save(
                                    { cart_data: JSON.stringify(cart_data) },
                                    { method: 'update', patch: true }
                                );
                            }
                        )
                        .then(
                            (ShoppingCart) => {
                                reply.apiSuccess(
                                    internals.getModelAsJson(ShoppingCart)
                                );
                            }
                        )
                        .catch(
                            (err) => {
                                winston.error(err);
                                reply(Boom.badData(err));
                            }
                        );
                }
            }
        },

        /**
         * Updates the quantity of the given items in the cart.
         * Payload data must be an object with keys and values as numbers
         *
         * Payload example:
         * {"data":{"1468253343391":1,"1468289834717":2}}
         */
        {
            method: 'POST',
            path: '/cart/qty/update',
            config: {
                description: 'Updates the quantity of the given item in the cart',
                validate: {
                    payload: {
                        data: Joi.object().pattern(/^[0-9]+$/, Joi.number().min(0))
                    }
                },
                handler: (request, reply) => {
                    internals
                        .findOrCreateSessionCart(request)
                        .then(
                            (ShoppingCart) => {
                                let cart_data = ShoppingCart.get('cart_data');
                                let canUpdate = false;

                                if(_.isString(cart_data)) {
                                    cart_data = JSON.parse(cart_data);
                                }

                                _.forEach(cart_data, (obj) => {
                                    if(obj.hasOwnProperty('itemId')
                                        && obj.hasOwnProperty('product')
                                        && _.isObject(obj.product)
                                        && obj.product.hasOwnProperty('qty')
                                        && request.payload.data.hasOwnProperty(obj.itemId)) {

                                        obj.product.qty = request.payload.data[obj.itemId];
                                        canUpdate = true;
                                    }
                                });

                                if(!canUpdate) {
                                    throw new Error(`Unable to update cart item because invalid item id was requested`);
                                }

                                // knex.js requires use of JSON.stringify() for json values;
                                // http://knexjs.org/#Schema-json
                                return ShoppingCart.save(
                                    {cart_data: JSON.stringify(cart_data)},
                                    {method: 'update', patch: true}
                                );
                            }
                        )
                        .then(
                            (ShoppingCart) => {
                                reply.apiSuccess(
                                    internals.getModelAsJson(ShoppingCart)
                                );
                            }
                        )
                        .catch(
                            (err) => {
                                request.server.log(['error'], err);
                                reply(Boom.badData(err));
                            }
                        );
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/checkout',
            config: {
                description: 'Braintree nonce received by the client. Complete the transaction',
                validate: {
                    payload: {
                        nonce: Joi.string().trim().required(),
                        shipping: Joi.reach(internals.schema, 'shipping').required(),
                        billing: Joi.reach(internals.schema, 'billing')
                    }
                },
                handler: (request, reply) => {
                    var cart;

                    internals
                        .findOrCreateSessionCart(request)
                        .then(
                            (ShoppingCart) => {
                                cart = ShoppingCart;
                                return server.plugins.Payments.runPayment(ShoppingCart, request);
                            }
                        )
                        .then(
                            () => {
                                request.server.appEvents.emit('gmnst-payment-success', cart);

                                reply.apiSuccess(
                                    internals.getModelAsJson(cart)
                                );
                            }
                        )
                        .catch(
                            (err) => {
                                winston.error(err);

                                HelperService.getBoomError(err, (error, result) => {
                                    reply(result);
                                });
                            }
                        );
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
    server.expose('findOrCreateSessionCart', internals.findOrCreateSessionCart);
    server.expose('getCartItemPrice', internals.getCartItemPrice);
    server.expose('getCartItemTotalPrice', internals.getCartItemTotalPrice);
    server.expose('getNumItemsInCart', internals.getNumItemsInCart);
    server.expose('getCartSalesTax', internals.getCartSalesTax);
    server.expose('getCartSubTotal', internals.getCartSubTotal);
    server.expose('getCartGrandTotal', internals.getCartGrandTotal);
    server.expose('STATUS_PAYMENT_SUCCESS', internals.STATUS_PAYMENT_SUCCESS);
    server.expose('STATUS_PAYMENT_FAILED', internals.STATUS_PAYMENT_FAILED);


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'ShoppingCart',
        require('./models/ShoppingCart')(baseModel, bookshelf, server)
    );


    return next();
};



exports.register = (server, options, next) => {
    server.dependency(['BookshelfOrm', 'Core', 'Products', 'Payments'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
