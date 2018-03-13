'use strict';

const Config = require('./config');

let internals = {};

internals.manifest = {
    connections: [
        // {
        //     host: 'localhost',
        //     port: Config.get('/port/web'),
        //     labels: ['web']
        // },
        {
            port: Config.get('/port/api'),
            labels: ['api'],
            routes: {
                // cors: false,
                cors: {
                    origin: ['*'],
                    headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match']
                }
                // security: {
                //     hsts: true,
                //     xframe: true,
                //     xss: true,
                //     noOpen: true,
                //     noSniff: true
                // }
            }
        }
    ],
    registrations: [
        {
            plugin: 'inert'
        },
        {
            plugin: 'vision'
        },
        // {
        //     plugin: {
        //         register: './plugins/crumbCsrf'
        //     }
        // },
        {
            plugin: {
                register: './plugins/logger'
            }
        },
        {
            plugin: {
                register: './plugins/bookshelf-orm',
                options: {
                    knex: {
                        debug: Config.get('/db/debug')
                    },
                    plugins: [
                        require('bookshelf-uuid')
                    ]
                }
            }
        },
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
                register: './plugins/customer'
            }
        },
        {
            plugin: {
                register: './plugins/products'
            },
            options: {
                select: ['api']
                // NOTE: not setting the routes.prefix value here
                // because I set it conditionally in the plugin route code
            }
        },
        {
            plugin: {
                register: './plugins/shopping-cart'
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
                register: './plugins/payments',
                options: {
                    isSandbox: process.env.BRAINTREE_ENVIRONMENT === 'Environment.SANDBOX',
                    merchantId: process.env.BRAINTREE_MERCHANT_ID,
                    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
                    privateKey: process.env.BRAINTREE_PRIVATE_KEY
                }
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
                register: './plugins/shipping'
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
    const webpackConfig = require('../build/webpack.dev.conf');

    internals.manifest.registrations.push(
        {
            plugin: {
                register: './plugins/hapi-webpack-plugin',
                options: {
                    'config': webpackConfig,

                    // See https://github.com/webpack/webpack-dev-middleware
                    'webpack-dev-middleware': {
                        host: 'localhost',
                        port: Config.get('/port/api'),
                        historyApiFallback: true,
                        publicPath: webpackConfig.output.publicPath,
                        noInfo: true,
                        lazy: false
                    },

                    // See https://github.com/glenjamin/webpack-hot-middleware
                    'webpack-hot-middleware': {
                    }
                }
            }
        }
    )
}


module.exports = internals.manifest;