const hapiJwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Boom = require('boom');
const uuidV4 = require('uuid/v4');
const HelperService = require('../../helpers.service');
const ApiClientService = require('./services/ApiClientService');


let internals = {};


internals.after = function (server, next) {
    const apiClientService = new ApiClientService(server);

    server.register(hapiJwt);

    // setting the 3rd argument to true means 'mode' is 'required'
    // see: http://hapijs.com/tutorials/auth#mode
    server.auth.strategy('jwt', 'jwt', true, {
        key: process.env.JWT_SERVER_SECRET,
        // key: Buffer(process.env.JWT_SERVER_SECRET, 'base64'),
        validateFunc: apiClientService.validateJwt,
        verifyOptions: {   // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
            ignoreExpiration: true,    // do not reject expired tokens
            algorithms: [ 'HS256' ]
        }
    });


    /***************************************
     * Route handlers
     /**************************************/

    internals.tokenGet = (request, reply) => {
        let uuid = uuidV4();

        // - Validate the API user
        // - Create a shopping cart token
        apiClientService
            .cryptPassword(process.env.CART_TOKEN_SECRET + uuid)
            .then((cartToken) => {
                if(!process.env.JWT_CLIENT_ID) {
                    throw new Error('Invalid API user');
                }
                if(!cartToken) {
                    throw new Error('Error creating cart token');
                }

                let jsonWebToken = jwt.sign(
                    {
                        jti: uuid,
                        clientId: process.env.JWT_CLIENT_ID,
                        ct: cartToken
                    },
                    process.env.JWT_SERVER_SECRET
                );

                return reply().header('X-Authorization', jsonWebToken);
            })
            .catch((err) => {
                global.logger.error(err);
                reply(Boom.unauthorized(err));
            });
    };


    internals.hash = (request, reply) => {
        apiClientService
            .cryptPassword(request.payload.value)
            .then((hashed) => {
                return reply({
                    hash: hashed
                })
            })
            .catch(
                (err) => {
                    reply(Boom.badRequest(err));
                }
            );
    };

    
    server.route([
        {
            method: 'POST',
            path: '/token/get',
            config: {
                auth: false,
                description: 'Gets a JWT token',
                handler: internals.tokenGet
            }
        }
    ]);

    // Just a convenience API to hash values, for development mode only
    if(HelperService.isDev()) {
        server.route([
            {
                method: 'POST',
                path: '/hash',
                config: {
                    auth: false,
                    description: 'Hashes a given value',
                    validate: {
                        payload: Joi.object({
                            value: Joi.string().required()
                        })
                    },
                    handler: internals.hash
                }
            }
        ]);
    }


    // LOADING BOOKSHELF MODEL:
    let baseModel = require('bookshelf-modelbase')(server.app.bookshelf);

    server.app.bookshelf.model(
        'ApiClients',
        require('./models/ApiClients')(baseModel, server.app.bookshelf, server)
    );

    return next();
}


exports.register = (server, options, next) => {
    server.dependency('BookshelfOrm', internals.after);
    return next();
};

exports.register.attributes = require('./package.json');