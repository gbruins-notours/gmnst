const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.cart_items,
        (t) => {
            t.increments('id');
            t.integer('qty').nullable();
            t.jsonb('variants').nullable();

            // Foreign Keys:
            t.integer('cart_id')
                .notNullable()
                .references('id')
                .inTable(InfoService.DB_TABLES.carts)
                .onDelete('CASCADE');

            t.integer('product_id')
                .notNullable()
                .references('id')
                .inTable(InfoService.DB_TABLES.products)
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
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.cart_items);
};