const Joi = require('joi');
const Hoek = require('hoek');

let internals = {};

internals.schema = Joi.object().keys({
    knex: Joi.object().keys({
        client: Joi.string().optional(),
        connection: Joi.string().optional(),
        debug: Joi.boolean().optional()
    }).optional(),
    // plugins: Joi.array().items(Joi.string()).default([]),
    plugins: Joi.array(),
    namespace: Joi.string()
});

internals.defaults = {
    knex: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        // connection: {
        //     database: process.env.PG_DB_NAME,
        //     user:     process.env.PG_USER,
        //     password: process.env.PG_PASSWORD
        // },
        debug: false
    }
};



exports.register = (server, options, next) => {
    let knex;
    let bookshelf = null;
    let requiredPlugins = ['registry', 'virtuals', 'visibility', 'pagination'];

    const validateOptions = internals.schema.validate(options);
    if (validateOptions.error) {
        server.log('error', validateOptions.error);
        return next(validateOptions.error);
    }

    const settings = Hoek.applyToDefaults(internals.defaults, options);
    settings.plugins = Array.isArray(settings.plugins) ? requiredPlugins.concat(settings.plugins) : requiredPlugins;

    try {
        knex = require('knex')(settings.knex);
        bookshelf = require('bookshelf');
        bookshelf = bookshelf(knex);
    }
    catch (ex) {
        return next(new Error('Bad Knex Options: ' + ex.toString()));
    }

    settings.plugins.map(function (plugin) {
        bookshelf.plugin(plugin);
    });

    if (settings.namespace) {
        server.expose(settings.namespace, bookshelf);
    } 
    else {
        // server.expose(bookshelf);
        server.expose('bookshelf', bookshelf);
    }

    //test
    server.expose('knexObject', knex);

    return next();
};

exports.register.attributes = require('./package.json');