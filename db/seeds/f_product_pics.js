const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.product_pics)
        .del()
        .then( () => {
            let promises = [];
            let d = new Date();

            for(let i=1; i<31; i++) {
                promises.push(
                    knex(InfoService.DB_TABLES.product_pics)
                        .insert({
                            // id: i,
                            file_name: 'sample_pic_' + i + '.png',
                            sort_order: i,
                            is_visible: true,
                            created_at: d,
                            updated_at: d,
                            product_id: i
                        })
                )
            }

            return Promise.all(promises);
        }
    );
};
