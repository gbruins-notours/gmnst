
module.exports = {

    development: {
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
            directory: './db/migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    },

    test: {
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
        client: 'pg',
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
        client: 'pg',
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
