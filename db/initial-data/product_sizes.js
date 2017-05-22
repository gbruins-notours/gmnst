const Promise = require('bluebird');
const faker = require('faker');
const InfoService = require('../../server/plugins/info/info.service');
const ProductService = require('../../server/plugins/products/products.service');


exports.seed = (knex) => {
    let sizeTypes = ProductService.getSizeTypes();

    return knex(InfoService.DB_TABLES.product_sizes)
        .del()
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.product_sizes}_id_seq RESTART WITH 1`);
        })
        .then( () => {
            let promises = [];

            for(let i=1; i<31; i++) {
                // Each product randomly gets various sizes
                (function(prodId) {
                    sizeTypes.forEach((size) => {
                        if (faker.random.boolean()) {
                            promises.push(
                                knex(InfoService.DB_TABLES.product_sizes)
                                    .insert({
                                        size: size,
                                        stock_qty: faker.random.number(25),
                                        is_visible: true,
                                        product_id: prodId
                                    })
                            );
                        }
                    });
                }(i));
            }

            return Promise.all(promises);
        });
};
