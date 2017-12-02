const cloneDeep = require('lodash.clonedeep');
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

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

let dev = cloneDeep(common);
// dev.connection = process.env.DATABASE_URL;
dev.connection = {
    host: process.env.DATA_DB_HOST,
    user: process.env.DATA_DB_USER,
    password: process.env.DATA_DB_PASS,
    database: 'gonano'
};

let prod = cloneDeep(common);
// prod.connection = {
//     host: process.env.POSTGRESQLCONNSTR_POSTGRES_HOST,
//     user: process.env.POSTGRESQLCONNSTR_POSTGRES_USER,
//     password: process.env.POSTGRESQLCONNSTR_POSTGRES_PASSWORD,
//     database: process.env.POSTGRESQLCONNSTR_POSTGRES_DB,
//     port: 5432,
//     ssl: true
// };
// prod.connection = `postgres://${process.env.POSTGRESQLCONNSTR_POSTGRES_USER}:${process.env.POSTGRESQLCONNSTR_POSTGRES_PASSWORD}@${process.env.POSTGRESQLCONNSTR_POSTGRES_HOST}:5432/${process.env.POSTGRESQLCONNSTR_POSTGRES_DB}?ssl=true`
prod.connection = {
    host: process.env.DATA_DB_HOST,
    user: process.env.DATA_DB_USER,
    password: process.env.DATA_DB_PASS,
    database: 'gonano',
    port: 5432,
    ssl: true
};

let config = {
    development: dev,
    production: prod
};

module.exports = config[env];
