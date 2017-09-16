const config = require('../knexfile');
const knex = require('knex')(config);

// Updating / seeding the DB
return knex.migrate.latest()
    .then(() => {
        // TODO: seed with real products, not sample data
        return knex.seed.run();
    })
    .then(() => {
        console.log("KNEX MIGRATION AND SEED DONE!");
        return;
    });
