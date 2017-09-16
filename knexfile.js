const cloneDeep = require('lodash.clonedeep');
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

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
dev.connection = process.env.DATABASE_URL;

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
