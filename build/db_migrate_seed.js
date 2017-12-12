const config = require('../knexfile');
const knex = require('knex')(config);

return knex.migrate.latest()
    .then(() => {
        // TODO: skip this in NODE_ENV = production?
        return knex.seed.run();
    })
    .then(() => {
        console.log("KNEX MIGRATION AND SEED DONE!");
        return;
    });
