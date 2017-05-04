const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.product_categories,
        (t) => {
            t.increments('id');
            t.string('label').nullable();
            t.boolean('is_visible');
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            t.index('id');
        }
    );
};



module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.product_categories);
};