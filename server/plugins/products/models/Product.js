const Joi = require('joi');
const CoreService = require('../../core/core.service');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend(
        {
            tableName: CoreService.DB_TABLES.products,

            uuid: true,

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
                // product_id is the foreign key in ProductPic
                return this.hasMany('ProductPic', 'product_id');
            },

            cart_items: function() {
                // product_id is the foreign key in ShoppingCartItem
                return this.hasMany('ShoppingCartItem', 'product_id');
            },

            // this is a feature added by bookshelf-modelbase
            validate: {
                title: Joi.string().max(100),
                description_short: Joi.string().max(500),
                description_long: Joi.string().max(750),
                sku: Joi.string().max(50),
                seo_uri: Joi.string().max(50),
                cost: Joi.number().precision(2).positive().max(99999999.99),
                weight_oz: Joi.number().precision(2).positive().max(99999999.99),
                base_price: Joi.number().precision(2).positive().max(99999999.99),
                sale_price: Joi.number().precision(2).positive().max(99999999.99),
                is_on_sale: Joi.boolean(),
                is_available: Joi.boolean(),
                tax_code: Joi.number(),
                featured_pic: Joi.string().max(100),
                video_url: Joi.string().max(500),
                gender: Joi.number().integer().positive(),
                type: Joi.number().integer().positive(),
                sub_type: Joi.number().integer().positive(),
                inventory_count: Joi.number().positive(),
                hide_if_out_of_stock: Joi.boolean(),
                product_artist_id: Joi.string().uuid(),
                created_at: Joi.date().optional(),
                updated_at: Joi.date().optional()
            },

            virtuals: {
                display_price: function() {
                    let price = 0;
                    let salePrice = this.get('sale_price') || 0;
                    let basePrice = this.get('base_price') || 0;

                    if(this.get('is_on_sale') && salePrice) {
                        price = salePrice;
                    }
                    else if(basePrice) {
                        price = basePrice;
                    }

                    return price;
                }
            }
        }
    );
};