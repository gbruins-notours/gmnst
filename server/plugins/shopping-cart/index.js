const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const winston = require('winston');
const HelperService = require('../../helpers.service');
const forEach = require('lodash.foreach');
const isObject = require('lodash.isobject');
const isEqual = require('lodash.isequal');
const isString = require('lodash.isstring');
const isFinite = require('lodash.isfinite');
const jwt = require('jsonwebtoken');


let internals = {};


/**
 * Joi definitions for the ShoppingCart model
 *
 * NOTE:
 * The 'max' values are based on what is accepted by Braintree:
 * https://developers.braintreepayments.com/reference/request/transaction/sale/node
 */
internals.schema = Joi.object().keys({
    token: Joi.string().trim().max(100).required(),
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


    // internals.withRelated = [
    //     {
    //         cart_items: (query) => {
    //             query.orderBy('created_at', 'DESC');
    //         }
    //     }
    // ];


    /**
     * Checks to see if the product is in the cart
     *
     * @param request
     * @param ShoppingCart  Bookshelf model
     * @returns number || false
     */
    internals.cartItemExists = (request, ShoppingCart) => {
        let cart_data = ShoppingCart.get('cart_data');
        let existingItemKey = null;

        if(Array.isArray(cart_data) && Product) {
            forEach(cart_data, (cartItem, key) => {
                if(isObject(cartItem.product)
                        && cartItem.product.id === request.payload.id
                        && isEqual(cartItem.product.__selectedOptions, request.payload.options)) {
                    existingItemKey = key;
                    return false;  // breaks out of forEach loop
                }
            });
        }

        return existingItemKey;
    };


    /**
     * Decodes the JWT token from the request and returns the cart token
     *
     * @param request
     * @returns {*}
     */
    internals.getCartToken = (request) => {
        if(request.auth.token) {
            let decoded = jwt.verify(request.auth.token, process.env.JWT_SERVER_SECRET);
            return decoded.ct;
        }
        return null;
    };


    /**
     * Finds the cart using the cart token from JWT
     *
     * @param request
     * @returns {Promise}
     */
    internals.findCart = (request) => {
        return new Promise((resolve, reject) => {
            server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart')
                .query((qb) => {
                    qb.where('token', '=', internals.getCartToken(request));
                    qb.whereNull('closed_at');
                    qb.whereNull('status');
                })
                .orderBy('created_at', 'DESC')
                .fetchPage({
                    pageSize: 1,
                    withRelated: [{
                        cart_items: (query) => {
                            query.orderBy('created_at', 'DESC');
                        }
                    }]
                })
                .then((collection) => {
                    // console.log("SHOPPING CARTS from findCart", collection.pagination, collection.models);

                    // models[0] will either be undefined (the cart does not exist) or the ShoppingCart model
                    resolve(collection.models[0]);
                })
                .catch((err) => {
                    reject(err);
                });
            }
        );
    };


    /**
     * Creates a new Shopping Cart in the DB
     *
     * @param request
     * @returns {Promise}
     */
    internals.createCart = (request) => {
        return new Promise( (resolve, reject) => {
            server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart')
                .forge()
                .save('token', internals.getCartToken(request))
                .then((model) => {
                    resolve(model);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };


    /**
     * Creates a new Shopping Cart Item in the DB
     *
     * @param request
     * @returns {Promise}
     */
    internals.createCartItem = (saveConfig) => {
        server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
            .forge()
            .save(
                saveConfig,
                { method: 'insert'}
            );
    };


    /**
     * A simple helper function to find by json property in the 'variant' column
     * Only searches the top level attributes of the variant json, so you'll need
     * to write your own code to search by any nested attributes.
     *
     * This is helpful:
     * https://gist.github.com/gerzhan/61a9d228caeb458d17e380aed8910531
     *
     * @param request
     * @returns {Promise}
     */
    internals.findCartItemByProductVariant = (cart_id, product_id, variantName, variantValue) => {
        return new Promise((resolve, reject) => {
            server.plugins.BookshelfOrm.bookshelf.model('ShoppingCartItem')
                .query((qb) => {
                    qb.where('cart_id', '=', cart_id);
                    qb.andWhere('product_id', '=', product_id);
                    qb.andWhere('variants', '@>', `{"${variantName}": "${variantValue}"}`);  //https://stackoverflow.com/questions/27780117/bookshelf-js-where-with-json-column-postgresql#36876753
                })
                .fetchPage({
                    pageSize: 1
                })
                .then((collection) => {
                    // models[0] will either be undefined (the cart item does not exist) or the ShoppingCartItem model
                    resolve(collection.models[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };


    /**
     * Finds the cart using the cart token from JWT,
     * or creates one if it doesn't exist
     *
     * @param request
     * @returns {Promise}
     */
    internals.findOrCreateCart = (request) => {
        return new Promise((resolve, reject) => {
            internals
                .findCart(request)
                .then((ShoppingCart) => {
                    if(ShoppingCart) {
                        resolve(ShoppingCart);
                    }
                    else {
                        internals
                            .createCart(request)
                            .then((ShoppingCart) => {
                                resolve(ShoppingCart);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                })
                .catch((err) => {
                    reject(err);
                });
            }
        );
    };


    //TODO: this needs to be updated
    /**
     * Returns the total number of items in the cart
     *
     * @param cartData
     * @returns {number}
     */
    internals.getNumItemsInCart = (cartData) => {
        let num = 0;

        if(isString(cartData)) {
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
            forEach(cartData, (cartItem) => {
                // NOTE:
                // It's best to use _.isFinite() here rather than _.isNumber() in case cartItem.qty is NaN
                // Technically, I guess NaN is a number:
                // https://github.com/jashkenas/underscore/issues/406
                if(isFinite(cartItem.qty)) {
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


    //TODO: this needs to be updated
    /**
     * Returns the sub-total for all items in the cart
     * (shipping and sales tax cost not included)
     *
     * @param cartData
     * @returns {number}
     */
    internals.getCartSubTotal = (cartData) => {
        let subtotal = 0;

        if(isString(cartData)) {
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
            forEach(cartData, (cartItem) => {
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
    // internals.addProductToCartORIG = (request) => {
    //     var p = new Promise( (resolve, reject) => {
    //
    //         Promise
    //             .all([
    //                 server.plugins.Products.getProductJsonFromRequest(request),
    //                 internals.findOrCreateCart(request)
    //             ])
    //             .then(
    //                 (results) => {
    //                     let decoratedProduct = results[0];
    //                     let ShoppingCart = results[1];
    //                     let qty = request.payload.qty || 1;
    //
    //                     let cart_data = ShoppingCart.get('cart_data');
    //                     let existingCartItemKey = internals.cartItemExists(cart_data, decoratedProduct.product);
    //
    //                     if(!Array.isArray(cart_data)) {
    //                         cart_data = [];
    //                     }
    //
    //                     // If this item is already in the cart then just update the qty:
    //                     if(existingCartItemKey !== null) {
    //                         if(cart_data[existingCartItemKey] && cart_data[existingCartItemKey].qty) {
    //                             cart_data[existingCartItemKey].qty += qty;
    //                         }
    //                     }
    //                     else {
    //                         // Item not in the cart yet, so add it
    //                         decoratedProduct.qty = qty;
    //                         cart_data.push({
    //                             itemId: new Date().valueOf(),
    //                             product: decoratedProduct
    //                         });
    //                     }
    //
    //                     return ShoppingCart.save(
    //                         // knex.js requires use of JSON.stringify() for json values;
    //                         // http://knexjs.org/#Schema-json
    //                         { cart_data: JSON.stringify(cart_data) },
    //                         { method: 'update', patch: true }
    //                     );
    //                 }
    //             )
    //             .then(
    //                 (ShoppingCart) => {
    //                     resolve(ShoppingCart);
    //                 }
    //             )
    //             .catch(
    //                 (err) => {
    //                     reject(err);
    //                 }
    //             );
    //     });
    //
    //     return p;
    // };


    /**
     * Adds a product to the shopping cart using the HTTP request data
     *
     * @returns {Promise}
     */
    internals.addProductToCart = (request) => {
        return new Promise( (resolve, reject) => {
            Promise
                .all([
                    server.plugins.Products.getProductByAttribute('id', request.payload.id),
                    internals.findOrCreateCart(request)
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
                        return internals
                            .findCartItemByProductVariant(shoppingCartId, productId, 'size', request.payload.options.size)
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
                        return internals.createCartItem({
                            qty: qty,
                            variants: JSON.stringify({
                                size: request.payload.options.size
                            }),
                            cart_id: shoppingCartId,
                            product_id: productId
                        });
                    }
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };


    internals.getModelAsJson = (ShoppingCartModel) => {
        let cartJson = ShoppingCartModel.toJSON();

        if(isString(cartJson.cart_data)) {
            cartJson.cart_data = JSON.parse(cartJson.cart_data);
        }

        return cartJson;
    };



    server.route([
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
                        .findOrCreateCart(request)
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
                        id: Joi.number().min(1).required(),
                        options: Joi.object({
                            size: Joi.string().uppercase().min(6), // 'SIZE_?'
                            qty: Joi.number().min(1).required()
                        }).required()
                    })
                },
                handler: (request, reply) => {
                    internals
                        .addProductToCart(request)
                        .then(() => {
                            return internals.findCart(request)
                        })
                        .then((ShoppingCart) => {
                            reply.apiSuccess(
                                internals.getModelAsJson(ShoppingCart)
                            );
                        })
                        .catch((err) => {
                            winston.error(err);
                            reply(Boom.badData(err));
                        });
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
                        .findOrCreateCart(request)
                        .then(
                            (ShoppingCart) => {
                                let cart_data = ShoppingCart.get('cart_data');
                                let deletedItem = null;

                                forEach(cart_data, (obj, key) => {
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
                        .findOrCreateCart(request)
                        .then(
                            (ShoppingCart) => {
                                let cart_data = ShoppingCart.get('cart_data');
                                let canUpdate = false;

                                if(isString(cart_data)) {
                                    cart_data = JSON.parse(cart_data);
                                }

                                forEach(cart_data, (obj) => {
                                    if(obj.hasOwnProperty('itemId')
                                        && obj.hasOwnProperty('product')
                                        && isObject(obj.product)
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
                        .findOrCreateCart(request)
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
    server.expose('findOrCreateCart', internals.findOrCreateCart);
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

    bookshelf['model'](
        'ShoppingCartItem',
        require('./models/ShoppingCartItem')(baseModel, bookshelf, server)
    );


    return next();
};



exports.register = (server, options, next) => {
    server.dependency(['BookshelfOrm', 'Core', 'Products', 'Payments'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
