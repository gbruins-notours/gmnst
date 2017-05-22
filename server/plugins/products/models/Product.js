const InfoService = require('../../info/info.service');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.products,

        hasTimestamps: true,

        artist: function() {
            // product_artist_id is the foreign key in this model
            return this.belongsTo('ProductArtist', 'product_artist_id');
        },

        sizes: function() {
            // product_id is the foreign key in ProductSize
            return this.hasMany('ProductSize', 'product_id');
        },

        pics: function() {
            // product_id is the foreign key in ProductGender
            return this.hasMany('ProductPic', 'product_id');
        }
    });
};