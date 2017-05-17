const Promise = require('bluebird');
const faker = require('faker');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.products)
        .del()
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.products}_id_seq RESTART WITH 1`);
        })
        .then(() => {
            let promises = [];
            let artistId = 0;
            let d = new Date();
            let cents;

            for(let i=1; i<31; i++) {
                if(artistId === 5) {
                    artistId = 0
                }

                cents = (i < 10) ? parseFloat('0.0' + i) : parseFloat('0.' + i);

                promises.push(
                    knex(InfoService.DB_TABLES.products)
                        .insert({
                            // id: i,
                            title: 'Product Title ' + i,
                            description_short: 'Short description ' + i + ' - ' + faker.lorem.sentence(),
                            description_long: 'Long description ' + i + ' - ' + faker.lorem.paragraph(),
                            sku: (10000 + i),
                            seo_uri: 'seo_uri_' + i,
                            cost: ((100 + i + cents).toFixed(2)),
                            base_price: ((100 + i + cents).toFixed(2)),
                            sale_price: ((99 - i + cents).toFixed(2)),
                            is_on_sale:  faker.random.boolean(),
                            is_available:  faker.random.boolean(),
                            tax_code: 20010,
                            featured_pic: 'sample-300-x-400.png',
                            video_url: 'https://www.youtube.com/watch?v=JUaY0AOLopU',
                            inventory_count: (100 + i),
                            hide_if_out_of_stock: true,
                            created_at: d,
                            updated_at: d,
                            product_artist_id: ++artistId,
                            product_category_id: 1,
                            product_type_id: i % 2 ? 1 : 2
                        })
                )
            }

            return Promise.all(promises);
        });
};