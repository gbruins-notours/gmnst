const CoreService = require('../../server/plugins/core/core.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        CoreService.DB_TABLES.customers,
        (t) => {
            t.increments('id');
            t.string('first_name');
            t.string('last_name').nullable();
            t.string('company').nullable();
            t.string('email').nullable();
            t.string('phone').nullable();
            t.string('fax').nullable();
            t.string('website').nullable();
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();
            t.dateTime('deleted_at').nullable();

            // Indexes:
            t.index('id');
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(CoreService.DB_TABLES.customers);
};