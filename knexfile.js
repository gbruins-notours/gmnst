const cloneDeep = require('lodash.clonedeep');

let common = {
    client: 'postgres',
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: './db/migrations',
        tableName: 'knex_migrations'
    },
    seeds: {
        directory: './db/seeds'
    }
};

let commonDB = {
    host: process.env.DATA_DB_HOST,
    user: process.env.DATA_DB_USER,
    password: process.env.DATA_DB_PASS,
    database: process.env.DATA_DB_NAME
}

let config = {
    development: null,
    production: null
};

// DEVELOPMENT
config.development = cloneDeep(common);
config.development.connection = cloneDeep(commonDB);

// PRODUCTION
config.production = cloneDeep(common);
config.production.connection = cloneDeep(commonDB);
// Not sure if these are needed on nanobox so commenting out for now:
// prod.connection.port = 5432;
// prod.connection.ssl = true;

let env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
module.exports = config[env];