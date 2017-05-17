const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.product_genders)
        .del()
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.product_genders}_id_seq RESTART WITH 1`);
        })
        .then( () => {
            let promises = [];
            let prod_gender_counter = 0;
            let d = new Date();

            for(let i=1; i<31; i++) {
                // Each product gets both gender types
                (function(prodId) {
                    promises.push(
                        knex(InfoService.DB_TABLES.product_genders)
                            .insert({
                                // id: ++prod_gender_counter,
                                gender_type: 1,
                                is_visible: true,
                                created_at: d,
                                updated_at: d,
                                product_id: prodId
                            })
                    );

                    promises.push(
                        knex(InfoService.DB_TABLES.product_genders)
                            .insert({
                                // id: ++prod_gender_counter,
                                gender_type: 2,
                                is_visible: true,
                                created_at: d,
                                updated_at: d,
                                product_id: prodId
                            })
                    );
                }(i));
            }

            return Promise.all(promises);
        });
};
