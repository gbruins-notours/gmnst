const Hoek = require('hoek');

let defaults = {
    client: 'pg',
    connection: {
        database: process.env.PG_DB_NAME,
        user:     process.env.PG_USER,
        password: process.env.PG_PASSWORD
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    },
    seeds: {
        directory: './db/seeds'
    }
};


let config = {};
config.development = Hoek.applyToDefaults(
    defaults,
    {
        migrations: {
            directory: './db/migrations'
        }
    }
);
config.test = config.development;
config.staging = config.development;
config.production = config.development;
// config.production = Hoek.applyToDefaults(
//     defaults,
//     {
//         connection: process.env.DATABASE_URL
//     }
// );


module.exports = config;
