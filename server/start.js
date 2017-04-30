const Hoek = require('hoek');
const path = require('path');
const Config = require('./config');
const Server = require('./index');
const webpackConfig = require('../build/webpack.dev.conf');

const internals = {};


internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 8000,
            labels: ['web']
        },
        {
            port: Config.get('/port/web'),
            labels: ['api'],
            routes: {
                cors: false,
                security: {
                    hsts: true,
                    xframe: true,
                    xss: true,
                    noOpen: true,
                    noSniff: true
                }
            }
        }
    ],
    registrations: [
        {
            plugin: 'inert'
        },
        // {
        //     plugin: {
        //         register: './plugins/crumbCsrf'
        //     }
        // },
        {
            plugin: {
                register: './plugins/apiClients'
            },
            options: {
                select: ['api'],
                routes: {
                    prefix: '/api/v1'
                }
            }
        },
        {
            plugin: {
                register: './plugins/apiDemo'
            },
            options: {
                select: ['api'],
                routes: {
                    prefix: '/api/v1'
                }
            }
        },
        {
            plugin: {
                register: './plugins/core'
            },
            options: {
                select: ['api']
            }
        }
    ]
};


if (process.env.NODE_ENV === 'development') {
    const Webpack = require('webpack');
    const compiler = new Webpack(webpackConfig);

    internals.manifest.registrations.push(
        {
            plugin: {
                register: './plugins/hapi-webpack-plugin',
                options: {
                    'compiler': compiler,

                    // See https://github.com/webpack/webpack-dev-middleware
                    'webpack-dev-middleware': {
                        publicPath: webpackConfig.output.publicPath,
                        stats: {
                            colors: true
                        }
                    },

                    // See https://github.com/glenjamin/webpack-hot-middleware
                    'webpack-hot-middleware': {
                    }
                }
            }
        }
    )
}


internals.composeOptions = {
    relativeTo: __dirname
};


Server.init(internals.manifest, internals.composeOptions, (err, server) => {
    Hoek.assert(!err, err);

    const api = server.select('api');
    console.log('API server started at: ' + api.info.uri);
});
