const CoreService = require('../../server/plugins/core/core.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        CoreService.DB_TABLES.cart_items,
        (t) => {
            t.uuid('id').primary();
            t.integer('qty').nullable();
            t.jsonb('variants').nullable();

            // Foreign Keys:
            t.uuid('cart_id')
                .notNullable()
                .references('id')
                .inTable(CoreService.DB_TABLES.carts)
                .onDelete('CASCADE');

            t.uuid('product_id')
                .notNullable()
                .references('id')
                .inTable(CoreService.DB_TABLES.products)
                .onDelete('CASCADE');

            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            t.index([
                'id',
                'cart_id',
                'product_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(CoreService.DB_TABLES.cart_items);
};