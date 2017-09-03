const Promise = require('bluebird');
const CoreService = require('../../server/plugins/core/core.service');


exports.seed = (knex) => {
    return knex(CoreService.DB_TABLES.product_pics)
        .del()
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${CoreService.DB_TABLES.product_pics}_id_seq RESTART WITH 1`);
        })
        .then(() => {
            let promises = [];
            let d = new Date();

            global.seedUuids = global.seedUuids || [];

            for(let i=1; i<31; i++) {
                promises.push(
                    knex(CoreService.DB_TABLES.product_pics)
                        .insert({
                            file_name: 'sample_pic_' + i + '.png',
                            sort_order: i,
                            is_visible: true,
                            created_at: d,
                            updated_at: d,
                            product_id: global.seedUuids[i-1]
                        })
                )
            }

            return Promise.all(promises);
        }
    );
};
