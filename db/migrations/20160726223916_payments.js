const CoreService = require('../../server/plugins/core/core.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        CoreService.DB_TABLES.payments,
        (t) => {
            t.uuid('id').primary();
            t.string('transaction_id');
            t.string('processor_response_code').nullable();
            t.string('amount').nullable();
            t.string('payment_type').nullable();
            t.string('currency_iso_code').nullable();
            t.jsonb('transaction').nullable();
            t.boolean('success');
            t.boolean('void');
            t.timestamp('created_at', true).notNullable().defaultTo(knex.fn.now());
            t.timestamp('updated_at', true).nullable();

            // Foreign Keys:
            t.uuid('cart_id')
                .notNullable()
                .references('id')
                .inTable(CoreService.DB_TABLES.carts)
                .onDelete('CASCADE');

            t.index([
                'id',
                'cart_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(CoreService.DB_TABLES.payments);
};
