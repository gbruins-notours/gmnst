const Joi = require('joi');
const Boom = require('boom');
const winston = require('winston');
const ProductService = require('../products/products.service');


let internals = {};


internals.after = function (server, next) {
    let getBraintreeToken = server.plugins['Payments'].getClientToken;

    server.route([
        {
            method: 'GET',
            path: '/info',
            config: {
                description: 'Gets app related info',
                handler: function (request, reply) {
                    getBraintreeToken()
                        .then((token) => {
                            reply.apiSuccess({
                                product: {
                                    types: ProductService.getProductTypes(),
                                    subTypes: ProductService.getProductSubTypes(),
                                    sizes: ProductService.getSizeTypes(),
                                    genders: ProductService.getGenderTypes()
                                },
                                shipping: {
                                    flatCost: process.env.SHIPPING_FLAT_COST || false
                                },
                                clientToken: token
                                // crumb: server.plugins.crumb.generate(request, reply)
                            });
                        })
                        .catch(
                            (err) => {
                                reply(Boom.badData(err));
                            }
                        );
                }
            }
        },
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
    server.dependency(['Payments', 'Products', 'BookshelfOrm'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
