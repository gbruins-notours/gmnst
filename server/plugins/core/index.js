const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const isObject = require('lodash.isobject');


exports.register = function (server, options, next) {

    server.decorate('reply', 'apiSuccess', function (responseData, paginationObj) {
        let response = {};
        response.data = responseData;

        if(isObject(paginationObj)) {
            response.pagination = paginationObj;
        }

        return this.response(response);
    });


    // Handle Boom errors
    server.ext('onPreResponse', function (request, reply) {
        if (request.response.isBoom) {
            if(process.env.NODE_ENV !== 'test') {
                global.logger.error(request.response)
            }
        }
        return reply.continue();
    });

    let routes = [
        {
            method: 'POST',
            path: '/api/v1/logger',
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
                        // Only supportig the 'error' and 'info' types for now
                        case 'error':
                            global.logger.error(request.payload.message);
                            break;

                        default:
                            global.logger.info(request.payload.message);
                    }

                    reply.apiSuccess();
                }
            }
        },
        {
            method: 'GET',
            path: '/socialbot',
            config: {
                auth: false
            },
            handler: function (request, reply) {
                console.log("GOT SOCIALBOT!", request.headers)
                reply.file(path.resolve(__dirname, '../../../dist/index.html'));
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            config: {
                auth: false
            },
            handler: function (request, reply) {
                reply.file(path.resolve(__dirname, '../../../dist/index.html'));

                // TODO: get CSRF token to add to template?
                // return reply.view('index', {
                //     crumb: request.plugins.crumb
                // });
                // return reply.view('index', {});
            }
        }
    ];

    // nginx handles static file access in production, for better performance
    // so only add these routes if running locally.
    // Even so it's probably best to develop locally using Nanobox, so perhaps
    // this can be removed
    if(process.env.IS_LOCAL) {
        routes.unshift(
            {
                method: 'GET',
                path: '/static/{filepath*}',
                config: {
                    auth: false,
                    cache: {
                        expiresIn: 24 * 60 * 60 * 1000,
                        privacy: 'public'
                    }
                },
                handler: {
                    directory: {
                        path: path.resolve(__dirname, '../../../dist/static/'),
                        listing: false,
                        index: false
                    }
                }
            },
            {
                path: '/favicon.ico',
                method: 'get',
                config: {
                    auth: false,
                    cache: {
                        expiresIn: 1000*60*60*24*21
                    }
                },
                handler: function(request, reply) {
                    // if (!options.path) {
                    //     return reply().code(204).type('image/x-icon');
                    // }
                    reply(null, fs.createReadStream(path.resolve(__dirname, '../../../dist/static/favicon.ico'))).code(200).type('image/x-icon');
                }
            }
        );
    }

    server.route(routes);

    return next();
};

exports.register.attributes = require('./package.json');
