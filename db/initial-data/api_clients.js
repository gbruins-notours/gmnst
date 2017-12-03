const Promise = require('bluebird');
const CoreService = require('../../server/plugins/core/core.service');
const ApiClientsService = require('../../server/plugins/apiClients/apiClients.service');


exports.seed = (knex) => {
    let hashedPassword;

    console.log("API CLIENT SEED env vars", process.env)
    
    return ApiClientsService
        .cryptPassword(process.env.JWT_CLIENT_SECRET)
        .then((pwd) => {
            hashedPassword = pwd;
            return knex(CoreService.DB_TABLES.api_clients).del()
        })
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${CoreService.DB_TABLES.api_clients}_id_seq RESTART WITH 1`);
        })
        .then(() => {
            let promises = [];
            let d = new Date();

            promises.push(
                knex(CoreService.DB_TABLES.api_clients)
                    .insert({
                        client_id: 'admin@gmnst.com',
                        client_secret: hashedPassword,
                        is_active: true,
                        created_at: d,
                        updated_at: d
                    })
            );

            return Promise.all(promises);
        });
};