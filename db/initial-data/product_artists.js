const Promise = require('bluebird');
const faker = require('faker');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.product_artists)
        .del()
        .then(() => {
            return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.product_artists}_id_seq RESTART WITH 1`);
        })
        .then(
            () => {
                let promises = [];
                let d = new Date();

                for(let i=1; i<6; i++) {
                    promises.push(
                        knex(InfoService.DB_TABLES.product_artists).insert({
                            description_short: 'Product artist ' + i + ' - ' + faker.lorem.sentence(),
                            description_long: 'Product artist ' + i + ' - ' + faker.lorem.paragraph(),
                            icon: 'sample_artist_icon.jpg',
                            city: 'City' + i,
                            prov_state: 'CA',
                            country: 'US',
                            email: 'artist_email_' + i + '@gmail.com',
                            created_at: d,
                            updated_at: d
                        })
                    )
                }

                return Promise.all(promises);
            }
        );
};