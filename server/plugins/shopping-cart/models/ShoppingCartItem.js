const InfoService = require('../../info/info.service');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.cart_items,

        hasTimestamps: true,

        // One-to-One relation with ShoppingCart
        // cart_id is the foreign key in this model
        cart: function() {
            return this.belongsTo('ShoppingCart', 'cart_id');
        },

        // One-to-One relation with ShoppingCart
        // product_id is the foreign key in this model
        product: function() {
            return this.belongsTo('Product', 'product_id');
        }
    });
};
