const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.api_clients,
        (t) => {
            t.increments('id');
            t.string('client_id');
            t.string('client_secret').nullable();
            t.string('is_active').nullable();
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            t.index([
                'id'
            ]);

            t.unique([
                'client_id'
            ])
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.api_clients);
};