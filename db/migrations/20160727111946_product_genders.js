const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.product_genders,
        (t) => {
            t.increments('id');
            t.integer('gender_type');
            t.boolean('is_visible');
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

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
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.product_genders);
};
