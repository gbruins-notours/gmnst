// const apiKey = process.env.NODE_ENV === 'development' ? process.env.SHIPPO_API_KEY_TEST : process.env.SHIPPO_API_KEY_PROD;
const apiKey = process.env.NODE_ENV === 'development' ? process.env.SHIPENGINE_API_KEY_TEST : process.env.SHIPENGINE_API_KEY_PROD;
const isObject = require('lodash.isobject');
const Joi = require('joi');
const Boom = require('boom');
const Wreck = require('wreck');
const Promise = require('bluebird');
const helpers = require('../../helpers.service.js')

const wreck = Wreck.defaults({
    baseUrl: 'https://api.shipengine.com/v1',
    json: true,
    headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
    }
});

let internals = {};

internals.validateAddress = (address) => {
    return new Promise((resolve, reject) => {
        wreck.post(
            '/addresses/validate',
            { payload: helpers.makeArray(address) },
            (err, res, payload) => {
                if(err) {
                    return reject(err);
                }

                return resolve(payload);
            }
        );
    });
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
                        name: Joi.string().optional(),
                        company_name: Joi.string().allow(''),
                        address_line1: Joi.string().required(),
                        address_line2: Joi.string().allow(''),
                        address_line3: Joi.string().allow(''),
                        city_locality: Joi.string().required(),
                        state_province: Joi.string().required(),
                        postal_code: Joi.string().required(),
                        country_code: Joi.string().max(3).regex(/^[A-z]+$/).required()
                    }
                },
                handler: (request, reply) => {
                    console.log("GET REQUEST", request.query)

                    internals
                        .validateAddress(request.query)
                        // .validateAddress(  {
                        //     "name": "Mickey and Minnie Mouse",
                        //     "phone": "714-781-4565",
                        //     "company_name": "The Walt Disney Company",
                        //     "address_line1": "500 South Buena Vista Street",
                        //     "city_locality": "Burbank",
                        //     "state_province": "CA",
                        //     "postal_code": "91521",
                        //     "country_code": "US"
                        //   })
                        .then((response) => {
                            console.log("ADDRESS VALIDATION SUCCESS", response);
                            //TODO - get value from response
                            reply.apiSuccess(response);
                        })
                        .catch((err) => {
                            console.log("ADDRESS VALIDATION ERR", err);
                            reply(Boom.badRequest(err));
                            return;
                        });
                }
            }
        }
    ]);

    // server.expose('validateAddress', internals.validateAddress);
    return next();
};

exports.register.attributes = require('./package.json');
