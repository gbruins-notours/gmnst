const Joi = require('joi');

let internals = {};


internals.after = function (server, next) {

    internals.schema = Joi.object().keys({
        firstName: Joi.string().trim().max(255),
        lastName: Joi.string().trim().max(255),
        company: Joi.string().trim().max(255),
        email: Joi.string().trim().email().max(255).required(),
        phone: Joi.string().trim().max(30).required(),
        fax: Joi.string().trim().max(30),
        website: Joi.string().trim().email().max(255)
    });


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'Customer',
        require('./models/Customer')(baseModel, bookshelf, server)
    );

    return next();
};


exports.register = (server, options, next) => {
    server.dependency('BookshelfOrm', internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
