'use strict';

const InfoService = require('../../info/info.service');

module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.payments,

        hasTimestamps: true,

        // One payment per shopping cart
        // http://bookshelfjs.org/#Model-instance-belongsTo
        shoppingCart: function() {
            return this.belongsTo('ShoppingCart', 'cart_id');
        }
    });
};
