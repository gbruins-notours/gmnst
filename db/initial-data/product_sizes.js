const Promise = require('bluebird');
const faker = require('faker');
const CoreService = require('../../server/plugins/core/core.service');
const ProductService = require('../../server/plugins/products/products.service');


exports.seed = (knex) => {
    let sizeTypes = ProductService.getSizeTypes();

    return knex(CoreService.DB_TABLES.product_sizes)
        .del()
        // .then(() => {
        //     return knex.raw(`ALTER SEQUENCE ${CoreService.DB_TABLES.product_sizes}_id_seq RESTART WITH 1`);
        // })
        .then(() => {
            let promises = [];

            global.productSizeSeedUuids = [];
            global.productSeedUuids = global.productSeedUuids || [];

            for(let i=1; i<31; i++) {
                // Each product randomly gets various sizes
                (function(prodId) {
                    sizeTypes.forEach((size) => {
                        let uuid = faker.random.uuid();
                        global.productSizeSeedUuids.push(uuid);

                        if (faker.random.boolean()) {
                            promises.push(
                                knex(CoreService.DB_TABLES.product_sizes)
                                    .insert({
                                        id: uuid,
                                        size: size,
                                        inventory_count: faker.random.number(25),
                                        is_visible: true,
                                        product_id: global.productSeedUuids[prodId-1]
                                    })
                            );
                        }
                    });
                }(i));
            }

            return Promise.all(promises);
        });
};
