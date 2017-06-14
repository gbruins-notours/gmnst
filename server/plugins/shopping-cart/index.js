const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const winston = require('winston');
const HelperService = require('../../helpers.service');
const forEach = require('lodash.foreach');
const isObject = require('lodash.isobject');
const isString = require('lodash.isstring');
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

    internals.ShoppingCartModel = server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart');


    // internals.withRelated = [
    //     {
    //         cart_items: (query) => {
    //             query.orderBy('created_at', 'DESC');
    //         }
    //     }
    // ];


    internals.findOrCreateCart = (request) => {
        return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart').findOrCreateCart(request);
    };


    internals.shoppingCartItem = {};

    /**
     * Adds a product to the shopping cart using the HTTP request data
     *
     * @returns {Promise}
     */
    internals.shoppingCartItem.add = (request) => {
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
                    reject(err);
                });
        });
    };


    internals.shoppingCartItem.get = (request, id) => {
        // First verify that there is an active shopping cart for the
        // JWT token from the request
        return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart')
            .getCart(request)
            .then((ShoppingCart) => {
                // No cart, so stop here
                if(!ShoppingCart) {
                    return;
                }

                // QUESTION
                // Can we just pluck one of the models from the cart_items collection
                // or is it better to make a DB query (as below)?
                return ShoppingCart.get('cart_items').get({
                    id
                });

                // return server.plugins.BookshelfOrm.bookshelf.collection('ShoppingCartItems')
                //     .query((qb) => {
                //         qb.where('cart_id', '=', ShoppingCart.get('id'));
                //         qb.andWhere('id', '=', id);
                //     })
                //     .fetch();
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
            .get(request, request.payload.id)
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
        //REFACTORED
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
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart);
                        })
                        .catch((err) => {
                            HelperService.getBoomError(err, (error, result) => {
                                reply(result);
                            });
                        });
                }
            }
        },
        //REFACTORED
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
                            reply.apiSuccess(ShoppingCart);
                        })
                        .catch((err) => {
                            winston.error(err);
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        //REFACTORED
        {
            method: 'POST',
            path: '/cart/item/remove/{id}',
            config: {
                description: 'Removes an item from the cart',
                validate: {
                    payload: {
                        id: Joi.number().min(1).required()
                    }
                },
                handler: (request, reply) => {
                    internals.shoppingCartItem
                        .remove(request)
                        .then(() => {
                            return server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart').getCart(request);
                        })
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart);
                        })
                        .catch((err) => {
                            winston.error(err);
                            reply(Boom.badData(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/cart/item/qty/update',
            config: {
                description: 'Updates the quantity of the given item in the cart',
                validate: {
                    payload: Joi.object({
                        id: Joi.number().min(1).required(),
                        options: Joi.object({
                            qty: Joi.number().min(1).required()
                        }).required()
                    })
                },
                handler: (request, reply) => {
                    internals
                        .findOrCreateCart(request)
                        .then((ShoppingCart) => {
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
                        })
                        .then((ShoppingCart) => {
                            reply.apiSuccess(ShoppingCart);
                        })
                        .catch((err) => {
                            request.server.log(['error'], err);
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
                        .then((ShoppingCart) => {
                            cart = ShoppingCart;
                            return server.plugins.Payments.runPayment(ShoppingCart, request);
                        })
                        .then(() => {
                            request.server.appEvents.emit('gmnst-payment-success', cart);
                            reply.apiSuccess(cart);
                        })
                        .catch((err) => {
                            winston.error(err);

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
    server.expose('findOrCreateCart', internals.findOrCreateCart);
    server.expose('STATUS_PAYMENT_SUCCESS', internals.STATUS_PAYMENT_SUCCESS);
    server.expose('STATUS_PAYMENT_FAILED', internals.STATUS_PAYMENT_FAILED);


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
    server.dependency(['BookshelfOrm', 'Core', 'Products', 'Payments'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
