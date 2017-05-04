'use strict';

const Config = require('./server/config');

module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: 'gmnst',
            user:     process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            port: 5432
        },
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
    },

    test: {
        client: 'postgresql',
        connection: {
            database: 'gmnst',
            user:     process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            port: 5432
        },
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
    },

    // https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
    // http://knexjs.org/#Installation-client
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    staging: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
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
    }

};
