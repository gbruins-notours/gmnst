const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.customers)
        .del()
        .then(() => {
            // return knex.raw(`ALTER TABLE ${InfoService.DB_TABLES.customers} AUTO_INCREMENT=1`);
            return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.customers}_id_seq RESTART WITH 1`);
            // return knex.raw('ALTER TABLE customers AUTO_INCREMENT=1');
        })
        .then(
            () => {
                let promises = [];
                let d = new Date();

                for(var i=1; i<6; i++) {
                    promises.push(
                        knex(InfoService.DB_TABLES.customers).insert({
                            // id: i,
                            first_name: 'fake_first_name_' + i,
                            last_name: 'fake_last_name_' + i,
                            company: 'fake_company_' + i,
                            email: 'fake_email' + i + '@gmail.com',
                            phone: '650-111-' + (1000 + i),
                            fax: '650-111-' + (1000 + i),
                            website: 'fakewebsite' + i + '.com',
                            created_at: d,
                            updated_at: d
                        })
                    );
                }

                return Promise.all(promises);
            }
        );
};