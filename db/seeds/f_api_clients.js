const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const InfoService = require('../../server/plugins/info/info.service');
const ApiClientsService = require('../../server/plugins/apiClients/api-clients.service');


exports.seed = (knex) => {
    let hashedPassword;

    return ApiClientsService
        .cryptPassword('G244.h"eSjV/')
        .then(
            (pwd) => {
                hashedPassword = pwd;
                return knex(InfoService.DB_TABLES.api_clients).del()
            }
        )
        .then(
            () => {
                let promises = [];
                let d = new Date();

                promises.push(
                    knex(InfoService.DB_TABLES.api_clients)
                        .insert({
                            client_id: 'admin@gmnst.com',
                            client_secret: hashedPassword,
                            is_active: true,
                            created_at: d,
                            updated_at: d
                        })
                );

                return Promise.all(promises);
            }
        );
};