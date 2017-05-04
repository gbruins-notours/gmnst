'use strict';

const InfoService = require('../../info/info.service');

module.exports = function (baseModel, bookshelf, server) {

    return baseModel.extend({
        tableName: InfoService.DB_TABLES.carts,

        hasTimestamps: true,

        hidden: ['id', 'sid', 'deleted_at'],

        virtuals: {
            num_items: function() {
                return server.plugins.ShoppingCart.getNumItemsInCart( this.get('cart_data') );
            },
            sub_total: function() {
                return server.plugins.ShoppingCart.getCartSubTotal( this.get('cart_data') );
            },
            sales_tax: function() {
                return server.plugins.ShoppingCart.getCartSalesTax( this.get('cart_data') );
            },
            grand_total: function() {
                return server.plugins.ShoppingCart.getCartGrandTotal( this.get('cart_data') );
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
        }
    });
};