const Joi = require('joi');
const winston = require('winston');

let internals = {};


internals.after = function (server, next) {
    server.route([
        {
            method: 'POST',
            path: '/logger',
            config: {
                description: 'Logs stuff',
                validate: {
                    payload: Joi.object({
                        type: Joi.string(),
                        message: Joi.string()
                    })
                },
                handler: function (request, reply) {
                    switch(request.payload.type) {
                        case 'error':
                            winston.error(request.payload.message);
                            break;

                        default:
                            winston.info(request.payload.message);
                    }

                    reply.apiSuccess();
                }
            }
        }
    ]);

    return next();
};


exports.register = function (server, options, next) {
    // server.dependency(['Payments', 'Products', 'CrumbCsrf'], internals.after);
    server.dependency(['BookshelfOrm'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
