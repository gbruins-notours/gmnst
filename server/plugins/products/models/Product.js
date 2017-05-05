const InfoService = require('../../info/info.service');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.products,

        hasTimestamps: true,

        artist: function() {
            // product_artist_id is the foreign key in this model
            return this.belongsTo('ProductArtist', 'product_artist_id');
        },

        category: function() {
            // product_category_id is the foreign key in this model
            return this.belongsTo('ProductCategory', 'product_category_id');
        },

        type: function() {
            // product_category_id is the foreign key in this model
            return this.belongsTo('ProductType', 'product_type_id');
        },

        sizes: function() {
            // product_id is the foreign key in ProductSize
            return this.hasMany('ProductSize', 'product_id');
        },

        genders: function() {
            // product_id is the foreign key in ProductGender
            return this.hasMany('ProductGender', 'product_id');
        },

        pics: function() {
            // product_id is the foreign key in ProductGender
            return this.hasMany('ProductPic', 'product_id');
        }
    });
};