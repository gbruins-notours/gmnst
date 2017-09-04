module.exports = {

    development: {
        client: 'postgresql',
        // connection: {
        //     host: process.env.PG_HOST,
        //     user: process.env.PG_USER,
        //     password: process.env.PG_PASSWORD,
        //     database: process.env.PG_DB_NAME,
        //     connection: process.env.DATABASE_URL,
        //     charset: 'utf8'
        // },
        connection: process.env.DATABASE_URL,
        // connection: {
        //     database: process.env.PG_DB_NAME
        // },
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

    production: {
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
