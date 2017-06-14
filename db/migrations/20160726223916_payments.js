const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.payments,
        (t) => {
            t.increments('id');
            t.string('transaction_id');
            t.string('processor_response_code').nullable();
            t.string('amount').nullable();
            t.string('payment_type').nullable();
            t.string('currency_iso_code').nullable();
            t.boolean('success');
            t.boolean('void');
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            // Foreign Keys:
            t.uuid('cart_id')
                .notNullable()
                .references('id')
                .inTable(InfoService.DB_TABLES.carts)
                .onDelete('CASCADE');

            t.index([
                'id',
                'cart_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.payments);
};
