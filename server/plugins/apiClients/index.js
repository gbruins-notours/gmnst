const hapiJwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const HelperService = require('../../helpers.service');
const uuidV4 = require('uuid/v4');


let internals = {};


/**
 * Creates a hash from a given password
 *
 * @param password
 * @returns {Promise}
 */
internals.cryptPassword = (password) => {
    return new Promise( (resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                return resolve(hash);
            });
        });
    });
};


/**
 * Compares a clear text password against the hashed password for a match
 *
 * @param password
 * @param userPassword
 * @returns {Promise}
 */
internals.comparePassword = (password, userPassword) => {
    return new Promise( (resolve, reject) => {
        bcrypt.compare(password, userPassword, (err, isPasswordMatch) => {
            if (err) {
                return reject(err);
            }

            return resolve(isPasswordMatch);
        });
    });
};


/**
 * Performs additional validation on the decoded JWT token
 *
 * @param decoded
 * @param request
 * @param cb
 */
internals.validateJwt = (decoded, request, cb) => {
    // for now no other validation is needed
    cb(null, true);

    // let ApiUsers = request.bookshelf.model('ApiUsers');
    // ApiUsers
    //     .forge({
    //         'client_id': decoded.clientId
    //     })
    //     .fetch()
    //     .then(
    //         (ApiUserModel) => {
    //             if (ApiUserModel && ApiUserModel.get('is_active')) {
    //                 return cb(null, true);
    //             }
    //
    //             return cb(null, false);
    //         }
    //     )
    //     .catch(
    //         (err) => {
    //             cb(null, false);
    //         }
    //     );
};






internals.after = function (server, next) {

    /**
     * Searches for an API user
     *
     * @returns {Promise}
     */
    internals.getApiUser = (clientId) => {
        let ApiUsers = server.plugins.BookshelfOrm.bookshelf.model('ApiUsers');

        return ApiUsers.forge({
            client_id: clientId
        }).fetch();
    };


    internals.validateApiUser = (request) => {
        return new Promise((resolve, reject) => {
            internals
                .getApiUser(request.payload.clientId)
                .then((ApiUserModel) => {
                    if (ApiUserModel) {
                        if (!ApiUserModel.get('is_active')) {
                            throw new Error('Invalid API user');
                        }

                        internals
                            .comparePassword(request.payload.clientSecret, ApiUserModel.get('client_secret'))
                            .then((isPasswordMatch) => {
                                if (isPasswordMatch) {
                                    return resolve(ApiUserModel);
                                }

                                throw new Error('Invalid API user');
                            })
                            .catch((err) => {
                                reject('Invalid API user');
                            });
                    }
                    else {
                        throw new Error('Invalid API user');
                    }
                })
                .catch((err) => {
                    reject('Invalid API user');
                });
        });
    };
    
    
    server.register(hapiJwt);


    // setting the 3rd argument to true means 'mode' is 'required'
    // see: http://hapijs.com/tutorials/auth#mode
    server.auth.strategy('jwt', 'jwt', true, {
        key: process.env.JWT_SERVER_SECRET,
        // key: Buffer(process.env.JWT_SERVER_SECRET, 'base64'),
        validateFunc: internals.validateJwt,
        verifyOptions: {   // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
            ignoreExpiration: true,    // do not reject expired tokens
            algorithms: [ 'HS256' ]
        }
    });


    server.route([
        {
            method: 'POST',
            path: '/token/get',
            config: {
                auth: false,
                description: 'Gets a JWT token',
                validate: {
                    payload: Joi.object({
                        clientId: Joi.string().required(),
                        clientSecret: Joi.string().required()
                    })
                },
                handler: (request, reply) => {
                    internals
                        .validateApiUser(request)
                        .then(
                            (ApiUser) => {
                                let token = jwt.sign(
                                    {
                                        jti: uuidV4(),
                                        clientId: ApiUser.clientId
                                    },
                                    process.env.JWT_SERVER_SECRET
                                );

                                return reply().header("X-Authorization", token);
                            }
                        )
                        .catch(
                            (err) => {
                                reply(Boom.unauthorized(err));
                            }
                        );
                }
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
                    handler: (request, reply) => {
                        internals
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
                    }
                }
            }
        ]);
    }


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'ApiUsers',
        require('./models/ApiClients')(baseModel, bookshelf, server)
    );
    
    // return next();
};



exports.register = (server, options, next) => {
    internals.after(server, next);
    // server.dependency('Core', internals.after);
    return next();
};

exports.register.attributes = require('./package.json');