const CoreService = require('../../core/core.service');

module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: CoreService.DB_TABLES.product_sizes,

        hasTimestamps: true,

        // http://bookshelfjs.org/#Model-instance-belongsTo
        // product_id is the foreign key in this model
        product: function() {
            return this.belongsTo('Product', 'product_id');
        }
    });
};
