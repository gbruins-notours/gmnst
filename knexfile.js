const cloneDeep = require('lodash.clonedeep');
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
// const env = 'production';

let common = {
    client: 'pg',
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
    host: process.env.POSTGRES_HOST_LOCAL,
    user: process.env.POSTGRES_USER_LOCAL,
    password: process.env.POSTGRES_PASSWORD_LOCAL,
    database: process.env.POSTGRES_DB_LOCAL
};

let prod = cloneDeep(common);
prod.connection = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: true
};

let config = {
    development: dev,
    production: prod
};

module.exports = config[env];
