const InfoService = require('../../info/info.service');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.product_pics,

        hasTimestamps: true,

        // One-to-One relation with Product
        // product_id is the foreign key in this model
        product: function() {
            return this.belongsTo('Product', 'product_id');
        }
    });
};
