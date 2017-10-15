'use strict';

const CoreService = require('../../core/core.service');

module.exports = function (baseModel, bookshelf) {
    return baseModel.extend(
        {
            tableName: CoreService.DB_TABLES.payments,

            uuid: true,

            hasTimestamps: true,

            // One payment per shopping cart
            // http://bookshelfjs.org/#Model-instance-belongsTo
            shoppingCart: function() {
                return this.belongsTo('ShoppingCart', 'cart_id');
            }
        },

        // Custom methods:
        {
            /**
             * Gets a payment by a given attribute
             *
             * @param attrName
             * @param attrValue
             * @returns {Promise}
             */
            getPaymentByAttribute: function(attrName, attrValue) {
                return this.query((qb) => {
                    qb.where(attrName, '=', attrValue);  // TODO: Is there a SQL injection risk here?
                })
                .fetch({
                    withRelated: [
                        'shoppingCart.cart_items.product' // https://stackoverflow.com/questions/35679855/always-fetch-from-related-models-in-bookshelf-js#35841710
                    ]
                })
            }

        }
    );
};
