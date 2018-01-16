const Promise = require('bluebird');
const CoreService = require('../../server/plugins/core/core.service');
const ApiClientsService = require('../../server/plugins/apiClients/apiClients.service');
const UserService = require('../../server/plugins/users/users.service');


exports.seed = (knex) => {
    let hashedPassword;

    return ApiClientsService
        .cryptPassword(process.env.ADMIN_PASSWORD)
        .then((pwd) => {
            hashedPassword = pwd;
            return knex(CoreService.DB_TABLES.users).del()
        })
        .then(() => {
            let promises = [];
            let d = new Date();

            promises.push(
                knex(CoreService.DB_TABLES.users)
                    .insert({
                        client_id: process.env.ADMIN_EMAIL,
                        client_secret: hashedPassword,
                        role: UserService.ROLE_ADMIN,
                        is_active: true,
                        created_at: d,
                        updated_at: d
                    })
            );

            return Promise.all(promises);
        });
};