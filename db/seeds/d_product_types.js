const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.product_types)
        .del()
        .then( () => {
            let promises = [];
            let d = new Date();

            promises.push(
                knex(InfoService.DB_TABLES.product_types)
                    .insert({
                        // id: 1,
                        label: 'Tops',
                        is_visible: true,
                        created_at: d,
                        updated_at: d
                    })
            );

            promises.push(
                knex(InfoService.DB_TABLES.product_types)
                    .insert({
                        // id: 2,
                        label: 'Hats',
                        is_visible: true,
                        created_at: d,
                        updated_at: d
                    })
            );

            return Promise.all(promises);
        });
};
