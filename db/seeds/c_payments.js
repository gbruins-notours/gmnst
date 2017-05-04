const Promise = require('bluebird');
const InfoService = require('../../server/plugins/info/info.service');


exports.seed = (knex) => {
    return knex(InfoService.DB_TABLES.payments)
        .del()
        .then(
            () => {
                let promises = [];
                let d = new Date();

                for(let i=1; i<6; i++) {
                    promises.push(
                        knex(InfoService.DB_TABLES.payments)
                            .insert({
                                // id: i,
                                transaction_id: '111111-' + i,
                                processor_response_code: 1000,
                                amount: (100 + i).toFixed(2),
                                payment_type: 'credit_card',
                                currency_iso_code: 'USD',
                                success: true,
                                created_at: d,
                                updated_at: d,
                                cart_id: i
                            })
                    )
                }

                return Promise.all(promises);
            }
        );
};
