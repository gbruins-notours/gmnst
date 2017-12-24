if(process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const config = require('../knexfile');
const knex = require('knex')(config);

return knex.seed.run().then((results) => {
    console.log("DB seed results:", results[0]);
    return;
});
