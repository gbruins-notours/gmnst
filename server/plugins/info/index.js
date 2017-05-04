const Boom = require('boom');
const ProductCategoriesService = require('../products/product-categories.service');
const ProductGenderService = require('../products/product-genders.service');
const ProductSizeService = require('../products/product-sizes.service');
const ProductTypeService = require('../products/product-types.service');


let internals = {};


internals.after = function (server, next) {
    let getBraintreeToken = server.plugins['Payments'].getClientToken;

    server.route({
        method: 'GET',
        path: '/info',
        config: {
            auth: 'jwt',
            description: 'Gets app related info',
            handler: function (request, reply) {
                getBraintreeToken()
                    .then(
                        (token) => {
                            reply.apiSuccess({
                                product: {
                                    category: ProductCategoriesService.getCategoryTypes(),
                                    gender: ProductGenderService.getGenderTypes(),
                                    size: ProductSizeService.getSizeTypes(),
                                    type: ProductTypeService.getTypes()
                                },
                                clientToken: token
                                // crumb: server.plugins.crumb.generate(request, reply)
                            });
                        }
                    )
                    .catch(
                        (err) => {
                            reply(Boom.unauthorized(err));
                        }
                    );
            }
        }
    });

    return next();
};


exports.register = function (server, options, next) {
    // server.dependency(['Payments', 'Products', 'CrumbCsrf'], internals.after);
    server.dependency(['Payments', 'Products'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');