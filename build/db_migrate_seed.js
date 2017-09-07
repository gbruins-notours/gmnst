const knexFile = require('../knexfile')
const config = knexFile[process.env.NODE_ENV]; // development, production
const knex = require('knex')(config);

// Updating / seeding the DB
knex.migrate.latest()
    .then(() => {
        // TODO: seed with real products, not sample data
        return knex.seed.run();
    })
    .then(() => {
        console.log("KNEX MIGRATION AND SEED DONE!")
    });
