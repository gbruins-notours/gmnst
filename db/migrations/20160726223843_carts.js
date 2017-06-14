const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.carts,
        (t) => {
            t.uuid('id').primary();
            t.string('token').nullable();
            t.string('billing_firstName').nullable();
            t.string('billing_lastName').nullable();
            t.string('billing_company').nullable();
            t.string('billing_streetAddress').nullable();
            t.string('billing_extendedAddress').nullable();
            t.string('billing_city').nullable();
            t.string('billing_state').nullable();
            t.string('billing_postalCode').nullable();
            t.string('billing_countryCodeAlpha2').nullable();
            t.string('billing_phone').nullable();
            t.string('shipping_firstName').nullable();
            t.string('shipping_lastName').nullable();
            t.string('shipping_streetAddress').nullable();
            t.string('shipping_extendedAddress').nullable();
            t.string('shipping_company').nullable();
            t.string('shipping_city').nullable();
            t.string('shipping_state').nullable();
            t.string('shipping_postalCode').nullable();
            t.string('shipping_countryCodeAlpha2').nullable();
            t.string('shipping_email').nullable();
            t.string('status').nullable();
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();
            t.dateTime('closed_at').nullable();

            // Foreign Keys:
            t.integer('customer_id')
                .references('id')
                .inTable(InfoService.DB_TABLES.customers)
                .onDelete('CASCADE');

            t.index([
                'id',
                'customer_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.carts);
};
