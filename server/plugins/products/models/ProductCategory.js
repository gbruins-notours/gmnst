const InfoService = require('../../info/info.service');

module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.product_categories,

        hasTimestamps: true,

        // http://bookshelfjs.org/#Model-instance-hasMany
        products: function() {
            return this.hasMany('Product', 'product_category_id');
        }
    });
};
