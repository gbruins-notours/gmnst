const winston = require('winston');
const path = require('path');
const fs = require('fs');
const webpackConfig = require('../../../build/webpack.dev.conf');
const icoPath = path.resolve(webpackConfig.output.path, 'static/favicon.ico');

let internals= {};


internals.after = function (server, next) {

    winston.handleExceptions(new winston.transports.File({
        filename: path.resolve(__dirname, '../../../build/logs/exceptions.log'),
        handleExceptions: true,
        humanReadableUnhandledException: true
    }));


    // Hande 404 errors
    server.ext('onPreResponse', function (request, reply) {
        if (request.response.isBoom) {
            if(request.response.output.statusCode === 404) {
                winston.error(request.response);
            }
        }
        return reply.continue();
    });


    server.route([
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
                reply(null, fs.createReadStream(icoPath)).code(200).type('image/x-icon');
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            config: {
                auth: false
            },
            handler: function (request, reply) {
                reply.file( path.resolve(__dirname, '../../../dist/index.html') );

                // TODO: get CSRF token to add to template?
                // return reply.view('index', {
                //     crumb: request.plugins.crumb
                // });
                // return reply.view('index', {});
            }
        }
    ]);

    // return next();
};



exports.register = function (server, options, next) {
    internals.after(server, next);
    return next();
};

exports.register.attributes = require('./package.json');



