const apiKey = process.env.NODE_ENV === 'development' ? process.env.SHIPPO_API_KEY_TEST : process.env.SHIPPO_API_KEY_PROD;
const shippo = require('shippo')(apiKey);
const isObject = require('lodash.isobject');
const Joi = require('joi');
const Boom = require('boom');

let internals = {};

/**
 * Validates a US or Australian shipping address
 * (only US and AU addresses can be validated right now)
 *
 * https://goshippo.com/docs/address-validation
 *
 * @param address
 * @example {
 *       name : 'Mr Hippo',
 *       company : 'SF Zoo',
 *       street1 : '2945 Sloat Blvd',
 *       city : 'San Francisco',
 *       state : 'CA',
 *       zip : '94132',
 *       country : 'US'
 * }
 */
internals.validateAddress = (address, callbackFn) => {
    address.validate = true;
    shippo.address.create(address, callbackFn);
}


exports.register = (server, options, next) => {

    server.route([
        {
            method: 'GET',
            path: '/shipping/validateAddress',
            config: {
                description: 'Validates an address',
                validate: {
                    query: {
                        street1: Joi.string().required(),
                        city: Joi.string().required(),
                        state: Joi.string().required(),
                        zip: Joi.string().required(),
                        country: Joi.string().required()
                    }
                },
                handler: (request, reply) => {
                    console.log("GET REQUEST", request.query)

                    internals.validateAddress(request.query, (err, response) => {
                        if(err) {
                            console.log("ADDRESS VALIDATION ERR", err);
                            reply(Boom.badRequest(err));
                            return;
                        }

                        console.log("ADDRESS VALIDATION RESPONSE", response);

                        //TODO - get value from response
                        reply.apiSuccess(response);
                    });
                }
            }
        }
    ]);

    // server.expose('validateAddress', internals.validateAddress);
    return next();
};

exports.register.attributes = require('./package.json');
