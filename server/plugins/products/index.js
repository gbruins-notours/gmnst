const Joi = require('joi');
const Boom = require('boom');
const path = require('path');
const fs = require('fs');
const isObject = require('lodash.isobject');
const fileType = require('file-type');
const Promise = require('bluebird');
const HelperService = require('../../helpers.service');
const ProductService = require('./products.service');

let internals = {};
let routePrefix = '/api/v1';

internals.after = function (server, next) {

    // Yes this was aleady set in the Core plugin, but apparently
    // it must be set in every plugin that needs a view engine:
    // https://github.com/hapijs/vision/issues/94
    server.views({
        engines: {
            html: require('handlebars')
        },
        // path: path.resolve(__dirname, '../../..')
        path: path.resolve(__dirname, '../../../dist')
        // path: '../../../dist/views',
        // partialsPath: '../../views/partials',
        // relativeTo: __dirname // process.cwd() // prefer this over __dirname when compiling to dist/cjs and using rollup
    });

    internals.schema = {
        title: Joi.string().max(100),
        description_short: Joi.string().max(500).allow(null),
        description_long: Joi.string().max(750).allow(null),
        sku: Joi.string().max(50).allow(null),
        seo_uri: Joi.string().max(50).allow(null),
        cost: Joi.number().precision(2).min(0).max(99999999.99),
        weight_oz: Joi.number().precision(2).min(0).max(99999999.99),
        base_price: Joi.number().precision(2).min(0).max(99999999.99),
        sale_price: Joi.number().precision(2).min(0).max(99999999.99),
        is_on_sale: Joi.boolean(),
        is_available: Joi.boolean(),
        tax_code: Joi.number().allow(null),
        featured_pic: Joi.string().max(100).allow(null),
        video_url: Joi.string().max(500).allow(null),
        gender: Joi.number().integer().positive(),
        type: Joi.number().integer().positive(),
        sub_type: Joi.number().integer().positive(),
        inventory_count: Joi.number().min(0),
        hide_if_out_of_stock: Joi.boolean(),
        product_artist_id: Joi.string().uuid().allow(null),
        created_at: Joi.date().optional(),
        updated_at: Joi.date().optional()
    };


    internals.productPicSchema = {
        sort_order: Joi.number().integer().min(0),
        is_visible: Joi.boolean(),
        product_id: Joi.string().uuid()
    };


    internals.productDirectory = process.env.NODE_ENV === 'production'
        ? path.join(__dirname, '../../../dist/static/images/product/') //TODO: is this the right path?
        : path.join(__dirname, '../../../static/images/product/');


    internals.getWithRelated = (opts) => {
        let options = opts || {};

        return [
            'artist',
            {
                sizes: (query) => {
                    if(!options.viewAllRelated) {
                        query.where('is_visible', '=', true);
                    }
                    query.orderBy('sort', 'ASC');
                },
    
                pics: (query) => {
                    if(!options.viewAllRelated) {
                        query.where('is_visible', '=', true);
                    }
                    query.orderBy('sort_order', 'ASC');
                }
            }
        ]
    }

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
            withRelated: internals.getWithRelated()
        };

        return internals.modelFetch('Product', forgeOpts, fetchOpts)
    };


    internals.saveProductPicture = (request) => {
        return new Promise((resolve, reject) => {
            if(request.payload.file) {
                let mimeTypeWhiteList = [
                    'image/png',
                    'image/gif',
                    'image/jpeg',
                    'image/pjpeg'
                ];

                let typeObj = fileType(request.payload.file._data);

                if(isObject(typeObj) && mimeTypeWhiteList.indexOf(typeObj.mime) > -1) {
                    let newFileName = `${request.payload.product_id}_${new Date().getTime()}.${typeObj.ext}`;
                    request.payload.file.pipe(
                        fs.createWriteStream(internals.productDirectory + newFileName)
                    )
                    resolve(newFileName);
                }
                else {
                    // THROW ERROR... illegal file type
                    reject('File type must be one of: ' + mimeTypeWhiteList.join(','))
                }
            }  
            else {
                resolve();
            }
        });
    };


    internals.deleteProductPicture = (ProductPic) => {
        return new Promise((resolve, reject) => {
            let fileName = ProductPic.get('file_name');

            if(fileName) {
                fs.unlink(internals.productDirectory + fileName, (err) => {
                    if(err) {
                        return reject(err);
                    }

                    return resolve(ProductPic);
                });
            }  
            else {
                return resolve(ProductPic);
            }
        });
    };


    /************************************
     * ROUTE HANDLERS
     ************************************/

    internals.productShare = (request, reply) => {
        let uriParts = request.query.uri.split('/');
        let seoUri = uriParts[uriParts.length - 1];

        internals
            .getProductByAttribute('seo_uri', seoUri)
            .then((product) => {
                let p = isObject(product) ? product.toJSON() : {};
                let urlImages = 'https://www.gmnst.com/static/images/';

                return reply.view('views/socialshare', {
                    title: p.title || 'Welcome to Gmnst.com',
                    description: p.description_short || '',
                    image: p.featured_pic ? `${urlImages}product/${p.featured_pic}` : `${urlImages}logo_header.png`,
                    url: `https://www.gmnst.com/${request.query.uri}`
                });
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productRoute = (request, reply) => {
        internals
            .modelFetch(
                'Product', 
                { id: request.query.id }, 
                { withRelated: internals.getWithRelated(request.query) }
            )
            .then((products) => {
                reply.apiSuccess(products);
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productSeo = (request, reply) => {
        internals
            .getProductByAttribute('seo_uri', request.query.id)
            .then((products) => {
                reply.apiSuccess(products);
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productInfo = (request, reply) => {
        reply.apiSuccess({
            types: ProductService.getProductTypes(),
            subTypes: ProductService.getProductSubTypes(),
            sizes: ProductService.getSizeTypes(),
            genders: ProductService.getGenderTypes()
        });
    };


    internals.productsRoute = (request, reply) => {
        HelperService
            .fetchPage(request, server.plugins.BookshelfOrm.bookshelf.model('Product'), internals.getWithRelated())
            .then((products) => {
                reply.apiSuccess(products, products.pagination);
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.notFound(err));
            });
    };


    internals.productCreate = (request, reply) => {
        server.plugins.BookshelfOrm.bookshelf.model('Product')
            .create(request.payload)
            .then((Product) => {
                if(!Product) {
                    reply(Boom.badRequest('Unable to create product.'));
                    return;
                }

                reply.apiSuccess(Product.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productUpdate = (request, reply) => {
        request.payload.updated_at = request.payload.updated_at || new Date();

        server.plugins.BookshelfOrm.bookshelf.model('Product')
            .update(request.payload, { id: request.payload.id })
            .then((Product) => {
                if(!Product) {
                    reply(Boom.badRequest('Unable to find product.'));
                    return;
                }

                reply.apiSuccess(Product.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    /***************************************
     * Product size route handlers
     /**************************************/
    internals.productSizeCreate = (request, reply) => {
        request.payload.sort = request.payload.sort || ProductService.getSizeTypeSortOrder(request.payload.size)

        server.plugins.BookshelfOrm.bookshelf.model('ProductSize')
            .create(request.payload)
            .then((ProductSize) => {
                if(!ProductSize) {
                    reply(Boom.badRequest('Unable to createa a new product size.'));
                    return;
                }

                reply.apiSuccess(ProductSize.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productSizeUpdate = (request, reply) => {
        request.payload.updated_at = request.payload.updated_at || new Date();

        server.plugins.BookshelfOrm.bookshelf.model('ProductSize')
            .update(request.payload, { id: request.payload.id })
            .then((ProductSize) => {
                if(!ProductSize) {
                    reply(Boom.badRequest('Unable to find product size.'));
                    return;
                }

                reply.apiSuccess(ProductSize.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productSizeDelete = (request, reply) => {
        request.payload.updated_at = request.payload.updated_at || new Date();

        server.plugins.BookshelfOrm.bookshelf.model('ProductSize')
            .destroy({ id: request.payload.id })
            .then((ProductSize) => {
                if(!ProductSize) {
                    reply(Boom.badRequest('Unable to find product size.'));
                    return;
                }

                reply.apiSuccess(ProductSize.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    /***************************************
     * Product picture route handlers
     /**************************************/
    internals.productPicCreate = (request, reply) => {
        internals
            .saveProductPicture(request)
            .then((newFileName) => {
                delete request.payload.file;
                request.payload.file_name = newFileName || null;
                return server.plugins.BookshelfOrm.bookshelf.model('ProductPic').create(request.payload)
            })
            .then((ProductPic) => {
                if(!ProductPic) {
                    reply(Boom.badRequest('Unable to create a a new product picture.'));
                    return;
                }

                reply.apiSuccess(ProductPic.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    internals.productPicUpdate = (request, reply) => {
        request.payload.updated_at = request.payload.updated_at || new Date();

        // server.plugins.BookshelfOrm.bookshelf.model('ProductPic')
        //     .update(request.payload, { id: request.payload.id })
        //     .then((ProductSize) => {
        //         if(!ProductSize) {
        //             reply(Boom.badRequest('Unable to find product size.'));
        //             return;
        //         }

        //         reply.apiSuccess(ProductSize.toJSON());
        //     })
        //     .catch((err) => {
        //         global.logger.error(err);
        //         global.bugsnag(err);
        //         reply(Boom.badRequest(err));
        //     });
    };


    internals.productPicDelete = (request, reply) => {
        request.payload.updated_at = request.payload.updated_at || new Date();

        const model = server.plugins.BookshelfOrm.bookshelf.model('ProductPic');

        model
            .findById(request.payload.id)
            .then((ProductPic) => {
                if(!ProductPic) {
                    reply(Boom.badRequest('Unable to find product picture.'));
                    return;
                }

                // get the file name and delete the file
                return internals.deleteProductPicture(ProductPic).catch((err) => {
                    // Catching the error here logs the error but does
                    // not prevent the flow from continuing.
                    global.logger.error(err);
                    global.bugsnag(err); // Hmm, is this bugsnag worthy?
                });
            })
            .then((ProductPic) => {
                //TODO: Get the product.  If this is the featured pic, assign a new one on the product
                
                return model.destroy({ id: request.payload.id })
            })
            .then((ProductPic) => {
                if(!ProductPic) {
                    reply(Boom.badRequest('Unable to find product picture.'));
                    return;
                }
                reply.apiSuccess(ProductPic.toJSON());
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.badRequest(err));
            });
    };


    server.route([
        {
            method: 'GET',
            path: `${routePrefix}/product`,
            config: {
                description: 'Finds a product by ID',
                validate: {
                    query: {
                        id: Joi.string().uuid(),
                        viewAllRelated: Joi.boolean().optional()
                    }
                },
                handler: internals.productRoute
            }
        },
        {
            method: 'GET',
            path: '/product/share',  // NOTE: no routePrefix on this one
            config: {
                auth: false,
                validate: {
                    query: {
                        uri: Joi.string()
                    }
                }
            },
            handler: internals.productShare
        },
        {
            method: 'GET',
            path: `${routePrefix}/product/seo`,
            config: {
                description: 'Finds a product by it\'s seo uri',
                validate: {
                    query: {
                        id: Joi.string().max(100)
                    }
                },
                handler: internals.productSeo
            }
        },
        {
            method: 'GET',
            path: `${routePrefix}/product/info`,
            config: {
                description: 'Returns general info about products',
                handler: internals.productInfo
            }
        },
        {
            method: 'GET',
            path: `${routePrefix}/products`,
            config: {
                description: 'Gets a list of products',
                handler: internals.productsRoute
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/create`,
            config: {
                description: 'Updates a product',
                validate: {
                    payload: Joi.object({
                        ...internals.schema
                    })
                },
                handler: internals.productCreate
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/update`,
            config: {
                description: 'Updates a product',
                validate: {
                    payload: Joi.object({
                        id: Joi.string().uuid().required(),
                        ...internals.schema
                    })
                },
                handler: internals.productUpdate
            }
        },

        // Product size
        {
            method: 'POST',
            path: `${routePrefix}/product/size/create`,
            config: {
                description: 'Adds a new size to the product',
                handler: internals.productSizeCreate
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/size/update`,
            config: {
                description: 'Updates a product size',
                handler: internals.productSizeUpdate
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/size/delete`,
            config: {
                description: 'Deletes a product size',
                validate: {
                    payload: {
                        id: Joi.string().uuid()
                    }
                },
                handler: internals.productSizeDelete
            }
        },

        // Product pictures
        {
            method: 'POST',
            path: `${routePrefix}/product/pic/create`,
            config: {
                description: 'Adds a new picture to the product',
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data',
                    maxBytes: 7 * 1000 * 1000  // 7MB
                },
                validate: {
                    payload: {
                        file: Joi.object(),
                        ...internals.productPicSchema
                    }
                },
                handler: internals.productPicCreate
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/pic/update`,
            config: {
                description: 'Updates a product picture',
                validate: {
                    payload: {
                        file: Joi.object(),
                        ...internals.productPicSchema
                    }
                },
                handler: internals.productPicUpdate
            }
        },
        {
            method: 'POST',
            path: `${routePrefix}/product/pic/delete`,
            config: {
                description: 'Deletes a product picture',
                validate: {
                    payload: {
                        id: Joi.string().uuid()
                    }
                },
                handler: internals.productPicDelete
            }
        }
    ]);


    // LOADING BOOKSHELF MODELS:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = require('bookshelf-modelbase')(bookshelf);

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
