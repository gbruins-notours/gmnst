const Promise = require('bluebird');
const faker = require('faker');
const InfoService = require('../../server/plugins/info/info.service');
const ProductService = require('../../server/plugins/products/products.service');

const productTypes = ProductService.getProductTypes();
const productSubTypes = ProductService.getProductSubTypes();
const fakeGenderOptions = buildSampleGenderOptions();


function buildSampleGenderOptions() {
    let types = ProductService.getGenderTypes();
    let opts = [];

    // adding one option for each gender
    Object.keys(types).forEach((key) => {
       opts.push(types[key]);
    });

    // adding a few multi-gender options
    opts.push( types.GENDER_TYPE_MENS | types.GENDER_TYPE_WOMENS );  // mens and womens
    opts.push( types.GENDER_TYPE_MENS | types.GENDER_TYPE_BOYS );  // mens and boys
    opts.push( types.GENDER_TYPE_WOMENS | types.GENDER_TYPE_GIRLS );  // womens and girls
    opts.push( types.GENDER_TYPE_BOYS | types.GENDER_TYPE_GIRLS );  // boys and girls

    return opts;
}


function getRandomGenderOption() {
    return fakeGenderOptions[Math.floor( Math.random() * fakeGenderOptions.length)];
}



exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.products)
        .del()
        // .then(() => {
        //     return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.products}_id_seq RESTART WITH 1`);
        // })
        .then(() => {
            let promises = [];
            let artistId = 0;
            let d = new Date();
            let cents;

            global.seedUuids = [];

            for(let i=1; i<31; i++) {
                if(artistId === 5) {
                    artistId = 0
                }

                cents = (i < 10) ? parseFloat('0.0' + i) : parseFloat('0.' + i);

                let uuid = faker.random.uuid();
                global.seedUuids.push(uuid);

                promises.push(
                    knex(InfoService.DB_TABLES.products)
                        .insert({
                            id: uuid,
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
                            gender: getRandomGenderOption(),
                            type: productTypes.PRODUCT_TYPE_APPAREL,
                            sub_type: i % 2 ? productSubTypes.PRODUCT_SUBTYPE_TOP : productSubTypes.PRODUCT_SUBTYPE_HAT,
                            inventory_count: (100 + i),
                            hide_if_out_of_stock: true,
                            created_at: d,
                            updated_at: d,
                            product_artist_id: ++artistId
                        })
                )
            }

            return Promise.all(promises);
        });
};