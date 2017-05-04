const Promise = require('bluebird');
const faker = require('faker');
const _ = require('lodash');
const InfoService = require('../../server/plugins/info/info.service');
const ProductSizesService = require('../../server/plugins/products/product-sizes.service');


exports.seed = (knex) => {
    let sizeTypes = ProductSizesService.getSizeTypes();

    return knex(InfoService.DB_TABLES.product_sizes)
        .del()
        .then( () => {
            let promises = [];
            let prod_size_id = 0;
            let d = new Date();

            for(let i=1; i<31; i++) {
                // Each product randomly gets various sizes
                (function(prodId) {
                    _.forEach(sizeTypes, (obj, key) => {
                        if (faker.random.boolean()) {
                            promises.push(
                                knex(InfoService.DB_TABLES.product_sizes)
                                    .insert({
                                        // id: ++prod_size_id,
                                        size_id: obj.id,
                                        label: key,
                                        sort_order: obj.display_order,
                                        in_stock: true,
                                        is_visible: true,
                                        created_at: d,
                                        updated_at: d,
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
