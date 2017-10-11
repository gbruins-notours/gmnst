const Joi = require('joi');
const Boom = require('boom');
const HelperService = require('../../helpers.service');
const ProductService = require('./products.service');

let internals = {};

internals.after = function (server, next) {

    internals.schema = Joi.object().keys({
        title: Joi.string().max(100).required(),
        description_short: Joi.string().max(500),
        description_long: Joi.string().max(750),
        sku: Joi.string().max(50),
        seo_uri: Joi.string().max(50),
        cost: Joi.number().precision(2).positive().max(99999999.99),
        base_price: Joi.number().precision(2).positive().max(99999999.99),
        sale_price: Joi.number().precision(2).positive().max(99999999.99),
        is_on_sale: Joi.boolean(),
        is_available: Joi.boolean(),
        featured_pic: Joi.string().max(100),
        video_url: Joi.string().max(500),
        inventory_count: Joi.number().positive(),
        hide_if_out_of_stock: Joi.boolean(),
        artist: Joi.number().integer().positive(),
        type: Joi.number().integer().positive(),
        category: Joi.number().integer().positive()
    });


    internals.withRelated = [
        'artist',
        {
            sizes: (query) => {
                query.where('is_visible', '=', true);
            },

            pics: (query) => {
                query.where('is_visible', '=', true);
                query.orderBy('sort_order', 'ASC');
            }
        }
    ];


    /**
     * Fetches data from a given product model
     *
     * @param attrName
     * @param attrValue
     * @returns {Promise}
     */
    internals.modelFetch = (modelName, forgeOptions, fetchOptions) => {
        return server.plugins.BookshelfOrm.bookshelf.model(modelName)
            .forge(forgeOptions)
            .fetch(fetchOptions);
    };


    /**
     * Gets a product by a given attribute
     *
     * @param attrName
     * @param attrValue
     * @returns {Promise}
     */
    internals.getProductByAttribute = (attrName, attrValue) => {
        let forgeOpts = null;

        if(attrName) {
            forgeOpts = {};
            forgeOpts[attrName] = attrValue;
        }

        let fetchOpts = {
            withRelated: internals.withRelated
        };

        return internals.modelFetch('Product', forgeOpts, fetchOpts)
    };


    server.route([
        {
            method: 'GET',
            path: '/product',
            config: {
                description: 'Finds a product by ID',
                validate: {
                    query: {
                        id: Joi.string().uuid()
                    }
                },
                handler: (request, reply) => {
                    internals
                        .getProductByAttribute('id', request.query.id)
                        .then((products) => {
                            reply.apiSuccess(products);
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badRequest(err));
                        });
                }
            }
        },
        {
            method: 'GET',
            path: '/product/seo',
            config: {
                description: 'Finds a product by it\'s seo uri',
                validate: {
                    query: {
                        id: Joi.string().max(100)
                    }
                },
                handler: (request, reply) => {
                    internals
                        .getProductByAttribute('seo_uri', request.query.id)
                        .then((products) => {
                            reply.apiSuccess(products);
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badRequest(err));
                        });
                }
            }
        },
        {
            method: 'GET',
            path: '/product/info',
            config: {
                description: 'Returns general info about products',
                handler: (request, reply) => {
                    reply.apiSuccess({
                        types: ProductService.getProductTypes(),
                        subTypes: ProductService.getProductSubTypes(),
                        sizes: ProductService.getSizeTypes(),
                        genders: ProductService.getGenderTypes()
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/products',
            config: {
                description: 'Gets a list of products',
                handler: (request, reply) => {
                    HelperService
                        .fetchPage(request, server.plugins.BookshelfOrm.bookshelf.model('Product'), internals.withRelated)
                        .then((products) => {
                            reply.apiSuccess(products, products.pagination);
                        })
                        .catch((err) => {
                            global.appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.notFound(err));
                        });
                }
            }
        }
    ]);


    // LOADING BOOKSHELF MODELS:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'Product',
        require('./models/Product')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductArtist',
        require('./models/ProductArtist')(baseModel, bookshelf, server)
    );
    

    bookshelf['model'](
        'ProductPic',
        require('./models/ProductPic')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductSize',
        require('./models/ProductSize')(baseModel, bookshelf, server)
    );


    server.expose('getProductByAttribute', internals.getProductByAttribute);

    return next();
};



exports.register = (server, options, next) => {
    server.dependency(['BookshelfOrm', 'Core'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
