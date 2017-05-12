const Joi = require('joi');
const Hoek = require('hoek');

let internals = {};

internals.schema = Joi.object().keys({
    knex: Joi.object().keys({
        client: Joi.string().optional(),
        connection: Joi.string().optional(),
        debug: Joi.boolean().optional()
    }).optional(),
    plugins: Joi.array().items(Joi.string()).default([]),
    namespace: Joi.string()
});

internals.defaults = {
    knex: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        // connection: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB_NAME}`,
        // connection: {
        //     database: process.env.PG_DB_NAME,
        //     user:     process.env.PG_USER,
        //     password: process.env.PG_PASSWORD
        // },
        debug: false
    },
    plugins: ['registry', 'virtuals', 'visibility', 'pagination'] // Required
};



exports.register = (server, options, next) => {

    let bookshelf = null;

    const validateOptions = internals.schema.validate(options);
    if (validateOptions.error) {
        return next(validateOptions.error);
    }

    const settings = Hoek.applyToDefaults(internals.defaults, options);
    let knex;

    try {
        knex = require('knex')(settings.knex);
        bookshelf = require('bookshelf');
        bookshelf = bookshelf(knex);
    } catch (ex) {
        return next(new Error('Bad Knex Options: ' + ex.toString()));
    }

    settings.plugins.map(function (plugin) {
        bookshelf.plugin(plugin);
    });

    if (settings.namespace) {
        server.expose(settings.namespace, bookshelf);
    } else {
        // server.expose(bookshelf);
        server.expose('bookshelf', bookshelf);
    }

    //test
    server.expose('knexObject', knex);

    return next();
};

exports.register.attributes = require('./package.json');