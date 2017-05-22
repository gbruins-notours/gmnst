const Boom = require('boom');
const Promise = require('bluebird');
const ProductService = require('../products/products.service');


let internals = {};


internals.after = function (server, next) {
    let getBraintreeToken = server.plugins['Payments'].getClientToken;

    server.route({
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
    });

    return next();
};


exports.register = function (server, options, next) {
    // server.dependency(['Payments', 'Products', 'CrumbCsrf'], internals.after);
    server.dependency(['Payments', 'Products', 'BookshelfOrm'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');