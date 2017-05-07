const Joi = require('joi');
const Boom = require('boom');
const HelperService = require('../../helpers.service');
const forEach = require('lodash.foreach');


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
        'type',
        {
            category: (query) => {
                query.where('is_visible', '=', true);
            },

            sizes: (query) => {
                query.where('is_visible', '=', true);
                query.orderBy('sort_order', 'ASC');
            },

            genders: (query) => {
                query.where('is_visible', '=', true);
            },

            pics: (query) => {
                query.where('is_visible', '=', true);
                query.orderBy('sort_order', 'ASC');
            }
        }
    ];


    /**
     * Gets a product by a given attribute
     *
     * @param attrName
     * @param attrValue
     * @returns {Promise}
     */
    internals.getProductByAttribute = (attrName, attrValue) => {
        let Product = server.plugins.BookshelfOrm.bookshelf.model('Product');

        let forgeOpts = {};
        forgeOpts[attrName] = attrValue;

        return Product
            .forge(forgeOpts)
            .fetch({
                withRelated: internals.withRelated
            });
    };


    /**
     * Uses the HTTP request data to retrieve product data
     * from the DB
     *
     * @param request
     * @returns {Promise}
     */
    internals.getProductJsonFromRequest = (request) => {
        let p = new Promise( (resolve, reject) => {
            let prod = request.payload.product;

            // Joi validation:
            let schema = Joi.object().keys({
                id: Joi.number().required(),
                __selectedOptions: Joi.object()
            }).required();

            let validateOptions = schema.validate(prod);
            if(validateOptions.error) {
                reject(validateOptions.error);
                return;
            }

            internals
                .getProductByAttribute('id', prod.id)
                .then(
                    (p) => {
                        let productJson = p.toJSON();
                        productJson.__selectedOptions = prod.__selectedOptions || {};

                        resolve(productJson);
                    }
                )
                .catch(
                    (err) => {
                        reject(err);
                    }
                );
        });

        return p;
    };


    server.route([
        {
            method: 'GET',
            path: '/product',
            config: {
                description: 'Finds a product by ID',
                validate: {
                    query: {
                        id: Joi.number().min(1)
                    }
                },
                handler: (request, reply) => {
                    internals
                        .getProductByAttribute('id', request.query.id)
                        .then(
                            (products) => {
                                reply.apiSuccess(products);
                            }
                        )
                        .catch(
                            (err) => {
                                request.server.log(['error'], err);
                                reply(Boom.badRequest(err));
                            }
                        );
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
                        .then(
                            (products) => {
                                reply.apiSuccess(products);
                            }
                        )
                        .catch(
                            (err) => {
                                request.server.log(['error'], err);
                                reply(Boom.badRequest(err));
                            }
                        );
                }
            }
        },
        {
            method: 'GET',
            path: '/products',
            config: {
                description: 'Gets a list of products',
                handler: (request, reply) => {
                    let Product = server.plugins.BookshelfOrm.bookshelf.model('Product');
                    let queryData = HelperService.queryHelper(request);

                    Product
                        .query((qb) => {
                            // qb.innerJoin('manufacturers', 'cars.manufacturer_id', 'manufacturers.id');
                            // qb.groupBy('cars.id');

                            if(queryData.where) {
                                qb.where(queryData.where[0], queryData.where[1], queryData.where[2]);
                            }

                            if(queryData.andWhere) {
                                forEach(queryData.andWhere, function(arr) {
                                    qb.andWhere(arr[0], arr[1], arr[2]);
                                });
                            }
                        })
                        .orderBy(queryData.orderBy, queryData.orderDir)
                        .fetchPage({
                            pageSize: queryData.pageSize || 100,
                            page: queryData.page || 1,
                            withRelated: internals.withRelated
                        })
                        .then(
                            (products) => {
                                reply.apiSuccess(products, products.pagination);
                            }
                        )
                        .catch(
                            (err) => {
                                request.server.log(['error'], err);
                                reply(Boom.notFound(err));
                            }
                        );
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
        'ProductCategory',
        require('./models/ProductCategory')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductGender',
        require('./models/ProductGender')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductPic',
        require('./models/ProductPic')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductSize',
        require('./models/ProductSize')(baseModel, bookshelf, server)
    );

    bookshelf['model'](
        'ProductType',
        require('./models/ProductType')(baseModel, bookshelf, server)
    );


    server.expose('getProductJsonFromRequest', internals.getProductJsonFromRequest);

    return next();
};



exports.register = (server, options, next) => {
    server.dependency(['BookshelfOrm', 'Core'], internals.after);
    return next();
};

exports.register.attributes = require('./package.json');
