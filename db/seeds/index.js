let api_clients = require('../initial-data/api_clients');
let customers = require('../initial-data/customers');
let payments = require('../initial-data/payments');
let product_artists = require('../initial-data/product_artists');
let product_categories = require('../initial-data/product_categories');
let product_genders = require('../initial-data/product_genders');
let product_pics = require('../initial-data/product_pics');
let product_sizes = require('../initial-data/product_sizes');
let product_types = require('../initial-data/product_types');
let products = require('../initial-data/products');
let shopping_carts = require('../initial-data/shopping_carts');

/**
 * Knex.js's seed functionality does not provide any order of execution guarantees,
 * so this function will run the seeds in the order that we want
 * 
 * @param knex
 * @param Promise
 * @returns {*}
 */
exports.seed = (knex, Promise) => {
    
    return customers.seed(knex, Promise)
        
        // Shopping Carts
        .then(() => {
            return shopping_carts.seed(knex, Promise);
        })
        
        // Payments
        .then(() => {
            return payments.seed(knex, Promise);
        })

        // Product Artists
        .then(() => {
            return product_artists.seed(knex, Promise);
        })

        // Product Categories
        .then(() => {
            return product_categories.seed(knex, Promise);
        })
            
        // Product Types
        .then(() => {
            return product_types.seed(knex, Promise);
        })
            
        // Products
        .then(() => {
            return products.seed(knex, Promise);
        })

        // ...the rest, which do not depend on any specific order
        .then(() => {
            return Promise.all([
                api_clients.seed(knex, Promise),
                product_genders.seed(knex, Promise),
                product_pics.seed(knex, Promise),
                product_sizes.seed(knex, Promise)
            ])
        });
    
};