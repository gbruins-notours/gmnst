'use strict';

const jwt = require('jsonwebtoken');
const accounting = require('accounting');
const isObject = require('lodash.isobject');
const CoreService = require('../../core/core.service');


module.exports = function (baseModel, bookshelf, server) {

    return baseModel.extend(
        {
            tableName: CoreService.DB_TABLES.carts,

            uuid: true,

            hasTimestamps: true,

            hidden: ['token', 'closed_at'],

            virtuals: {
                num_items: function() {
                    let numItems = 0;

                    this.related('cart_items').forEach((model) => {
                        numItems += parseInt(model.get('qty') || 0, 10);
                    });

                    return numItems;
                },
                product_weight_total: function() {
                    let weight = 0;

                    this.related('cart_items').forEach((model) => {
                        let prod = model.related('product');
                        let qty = model.get('qty');

                        if(prod && qty) {
                            weight += parseFloat((prod.get('weight_oz') * qty) || 0); 
                        }
                    });

                    return accounting.toFixed(weight, 1);
                },
                sub_total: function() {
                    // return server.plugins.ShoppingCart.getCartSubTotal( this.related('cart_data') );
                    let subtotal = 0;

                    this.related('cart_items').forEach((model) => {
                        subtotal += parseFloat(model.get('total_item_price') || 0);
                    });

                    // NOTE: accounting.toFixed() returns a string!
                    // http://openexchangerates.github.io/accounting.js/
                    return accounting.toFixed(subtotal, 2);
                },
                shipping_total: function() {
                    let obj = this.get('shipping_rate');
                    if(isObject(obj) && isObject(obj.shipping_amount)) {
                        return accounting.toFixed(obj.shipping_amount.amount, 2);
                    }
                    return null;
                },
                grand_total: function() {
                    let subtotal = parseFloat(this.get('sub_total'));
                    let salesTax = parseFloat(this.get('sales_tax') || 0);
                    let shipping = parseFloat(this.get('shipping_total') || 0);

                    return accounting.toFixed((subtotal + salesTax + shipping), 2);
                }
            },

            // Relationships:

            // A payment could fail first, then another attempt
            // could succeed, all related to the same ShoppingCart,
            // so a ShoppingCart can have many Payments
            //
            // http://bookshelfjs.org/#Model-instance-hasMany
            payments: function() {
                return this.hasMany('Payment', 'cart_id');
            },

            // http://bookshelfjs.org/#Model-instance-belongsTo
            customer: function() {
                return this.belongsTo('Customer', 'customer_id');
            },

            // cart_id is the foreign key in ShoppingCartItem
            cart_items: function() {
                return this.hasMany('ShoppingCartItem', 'cart_id');
            }
        },

        // Custom methods:
        {
            getCartToken: function(request) {
                if(request.auth.token) {
                    let decoded = jwt.verify(request.auth.token, process.env.JWT_SERVER_SECRET);
                    return decoded.ct;
                }
                return null;
            },


            /**
             * Finds the cart using the cart token from JWT
             *
             * @param request
             * @returns {Promise}
             */
            getCart: function(request) {
                return this.query((qb) => {
                    qb.where('token', '=', this.getCartToken(request));
                    qb.whereNull('closed_at');
                    qb.whereNull('status');
                })
                .orderBy('created_at', 'DESC')
                .fetch({
                    withRelated: [
                        'cart_items.product', // https://stackoverflow.com/questions/35679855/always-fetch-from-related-models-in-bookshelf-js#35841710
                        {
                            cart_items: (query) => {
                                // Sorting by updated_at (instead of created_at) will keep the most recently
                                // updated cart item at the top of the list, which I think is the most
                                // expected user experience
                                query.orderBy('updated_at', 'DESC');
                            }
                        }
                    ]
                })
            },


            /**
             * Finds the cart using the cart token from JWT,
             * or creates one if it doesn't exist
             *
             * @param request
             * @returns {Promise}
             */
            findOrCreateCart: function(request) {
                let self = this;

                // If the shipping rate is a flat cost then adding it to the model now
                // so it will be readily available at checkout.  If we ever decide to 
                // provide multiple shipping options in the future then this value can 
                // be overridden by whatever option the user chooses at checkout.
                return self.getCart(request)
                    .then((ShoppingCart) => {
                        return ShoppingCart || self.create({
                            token: self.getCartToken(request)
                        });
                    })
            }

        }
    );
};
