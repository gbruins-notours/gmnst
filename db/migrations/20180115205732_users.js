const CoreService = require('../../server/plugins/core/core.service');


module.exports.up = (knex, Promise) => {
    return knex.schema.createTable(
        CoreService.DB_TABLES.users,
        (t) => {
            t.uuid('id').primary();
            t.string('user_email');
            t.string('user_password').nullable();
            t.integer('role').nullable();
            t.string('is_active').nullable();
            t.timestamp('created_at', true).notNullable().defaultTo(knex.fn.now());
            t.timestamp('updated_at', true).nullable();

            t.index([
                'id'
            ]);

            t.unique([
                'user_email'
            ])
        }
    );
};


module.exports.down = (knex, Promise) => {
    return knex.schema.dropTableIfExists(CoreService.DB_TABLES.users);
};
