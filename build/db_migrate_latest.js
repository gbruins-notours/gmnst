if(process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const config = require('../knexfile');
const knex = require('knex')(config);

return knex.migrate.latest()
    .then((results) => {
        console.log("Migration results:", results[1]);
        return;
    });
