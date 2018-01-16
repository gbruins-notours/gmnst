const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const isObject = require('lodash.isobject');
const HelperService = require('../../helpers.service');
const uuidV4 = require('uuid/v4');
const ApiClientsService = require('../apiClients/apiClients.service');

let internals = {};


internals.after = function (server, next) {

    /**
     * Searches for a User
     *
     * @returns {Promise}
     */
    internals.getUser = (username) => {
        let Users = server.plugins.BookshelfOrm.bookshelf.model('Users');

        return Users.forge({
            user_email: username
        }).fetch();
    };



    /************************************
     * ROUTE HANDLERS
     ************************************/

    internals.adminLogin = (request, reply) => {
        internals
            .getUser(request.payload.username)
            .then((User) => {
                if(User) {
                    if (!User.get('is_active')) {
                        throw new Error('Invalid user');
                    }

                    ApiClientsService
                        .comparePassword(request.payload.password, User.get('user_password'))
                        .then((isPasswordMatch) => {
                            if (isPasswordMatch) {
                                let jsonWebToken = jwt.sign(
                                    {
                                        jti: uuidV4(),
                                        user: User.toJSON()
                                    },
                                    process.env.JWT_SERVER_SECRET
                                );

                                return reply().header('X-Authorization', jsonWebToken);
                            }
                            else {
                                throw new Error('Invalid user');
                            }
                        })
                }
            })
            .catch((err) => {
                global.logger.error(err);
                global.bugsnag(err);
                reply(Boom.unauthorized(err));
            });
    }


    server.route([
        {
            method: 'POST',
            path: '/admin/login',
            config: {
                auth: false,
                validate: {
                    payload: {
                        username: Joi.string().email(),
                        password: Joi.string()
                    }
                },
                handler: internals.adminLogin
            }
        }
    ]);


    // LOADING BOOKSHELF MODEL:
    let bookshelf = server.plugins.BookshelfOrm.bookshelf;
    let baseModel = bookshelf.Model.extend({});

    bookshelf['model'](
        'Users',
        require('./models/Users')(baseModel, bookshelf, server)
    );

    return next();
}


exports.register = (server, options, next) => {
    server.dependency('BookshelfOrm', internals.after);
    return next();
};

exports.register.attributes = require('./package.json');