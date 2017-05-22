const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.carts)
        .del()
        .then(() => {
                return knex.raw(`ALTER SEQUENCE ${InfoService.DB_TABLES.carts}_id_seq RESTART WITH 1`);
        })
        .then( () => {
            let promises = [];
            let d = new Date();

            for(let i=1; i<6; i++) {
                promises.push(
                    (function(num) {
                        return knex(InfoService.DB_TABLES.carts)
                            .insert({
                                sid: 'fake_sid_' + num,
                                billing_firstName: 'fake_billing_firstName_' + num,
                                billing_lastName: 'fake_billing_lastName_' + num,
                                billing_company: 'fake_billing_company_' + num,
                                billing_streetAddress: 'fake_billing_streetAddress_' + num,
                                // billing_extendedAddress: 'fake_billing_extendedAddress_' + num,
                                billing_city: 'fake_billing_city_' + num,
                                billing_state: 'fake_billing_city_' + num,
                                billing_postalCode: (10000 + num),
                                billing_countryCodeAlpha2: 'US',
                                billing_phone: '650-111-' + (1000 + num),
                                shipping_firstName: 'fake_shipping_firstName_' + num,
                                shipping_lastName: 'fake_shipping_lastName_' + num,
                                shipping_streetAddress: 'fake_shipping_streetAddress_' + num,
                                shipping_extendedAddress: 'fake_shipping_extendedAddress_' + num,
                                shipping_company: 'fake_shipping_company_' + num,
                                shipping_city: 'fake_shipping_city_' + num,
                                shipping_state: 'fake_shipping_state_' + num,
                                shipping_postalCode: (20000 + num),
                                shipping_countryCodeAlpha2: 'US',
                                shipping_email: 'fake_email' + num + '@gmail.com',
                                status: 'payment_success',
                                created_at: d,
                                updated_at: d,
                                customer_id: num
                            })
                    }(i))
                )
            }

            return Promise.all(promises);
        }
    );
};