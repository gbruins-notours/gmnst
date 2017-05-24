const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.product_sizes,
        (t) => {
            t.increments('id');
            t.string('size').nullable();
            t.integer('inventory_count').notNull();
            t.boolean('is_visible');

            // Foreign Keys:
            t.integer('product_id')
                .notNullable()
                .references('id')
                .inTable(InfoService.DB_TABLES.products)
                .onDelete('CASCADE');

            t.index([
                'id',
                'product_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.product_sizes);
};