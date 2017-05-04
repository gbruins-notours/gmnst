const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.product_categories)
        .del()
        .then( () => {
            let promises = [];
            let d = new Date();

            promises.push(
                knex(InfoService.DB_TABLES.product_categories)
                    .insert({
                        // id: 1,
                        label: 'Apparel',
                        is_visible: true,
                        created_at: d,
                        updated_at: d
                    })
            );

            return Promise.all(promises);
        });
};
