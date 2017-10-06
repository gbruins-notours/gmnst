const Joi = require('joi');
const Boom = require('boom');
const Wreck = require('wreck');
const Promise = require('bluebird');
const helpers = require('../../helpers.service.js');

const wreck = Wreck.defaults({
    baseUrl: 'https://api.shipengine.com/v1',
    json: true,
    headers: {
        'api-key': process.env.SHIPENGINE_API_KEY_PROD,
        'Content-Type': 'application/json'
    }
});

let internals = {};


internals.getShipEngineErrorMessage = (err) => {
    let message = null;

    if(err.data.isResponseError && Array.isArray(err.data.payload.errors)) {
        let msgs = [];

        err.data.payload.errors.forEach((obj) => {
            msgs.push(obj.message)
        });

        if(msgs.length) {
            message = msgs.join(' ');
        }
    }

    return message;
}

internals.validateAddress = (address) => {
    return new Promise((resolve, reject) => {
        wreck.post(
            '/addresses/validate',
            { payload: helpers.makeArray(address) },
            (err, res, payload) => {
                if(err) {
                    return reject(new Error('ERROR VALIDATING SHIPPING ADDRESS: ' + internals.getShipEngineErrorMessage(err)));
                }

                return resolve(payload);
            }
        );
    });
};


internals.getShippingRates = (config) => {
    return new Promise((resolve, reject) => {
        wreck.post(
            '/rates',
            { payload: config },
            (err, res, payload) => {
                if(err) {
                    return reject(new Error('ERROR GETTING SHIPPING RATES: ' + internals.getShipEngineErrorMessage(err)));
                }

                return resolve(payload);
            }
        );
    });
}


exports.register = (server, options, next) => {

    server.route([
        {
            method: 'POST',
            path: '/shipping/validateAddress',
            config: {
                description: 'Validates an address',
                validate: {
                    payload: {
                        name: Joi.string(),
                        company_name: Joi.string().allow(null),
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
                    internals
                        .validateAddress(request.payload)
                        .then((response) => {
                            //TODO - get value from response
                            reply.apiSuccess(response);
                        })
                        .catch((err) => {
                            appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badRequest(err));
                        });
                }
            }
        },
        {
            method: 'POST',
            path: '/shipping/rates',
            config: {
                description: 'Returns shipping rates',
                validate: {
                    payload: {
                        validate_address: Joi.string().required(),
                        ship_to: Joi.object().keys({
                            name: Joi.string().optional(),
                            company_name: Joi.string().allow(''),
                            address_line1: Joi.string().required(),
                            address_line2: Joi.string().allow(''),
                            address_line3: Joi.string().allow(''),
                            city_locality: Joi.string().required(),
                            state_province: Joi.string().required(),
                            postal_code: Joi.string().required(),
                            country_code: Joi.string().max(3).regex(/^[A-z]+$/).required()
                        }),
                        packages: Joi.array().items(
                            Joi.object().keys({
                                weight: Joi.object().keys({
                                    value: Joi.number().precision(3).required(),
                                    unit: Joi.string().required()
                                })
                            })
                        )
                    }
                },
                handler: (request, reply) => {
                    let payload = {
                        shipment: request.payload,
                        rate_options: {
                            carrier_ids: [ process.env.SHIPENGINE_CARRIER_ID_FEDEX ]
                        }
                    };

                    payload.shipment.ship_from = {
                        name: process.env.SHIPPING_ADDRESS_FROM_NAME,
                        address_line1: process.env.SHIPPING_ADDRESS_FROM_ADDRESS1,
                        city_locality: process.env.SHIPPING_ADDRESS_FROM_CITY,
                        state_province: process.env.SHIPPING_ADDRESS_FROM_STATE,
                        postal_code: process.env.SHIPPING_ADDRESS_FROM_ZIP,
                        country_code: process.env.SHIPPING_ADDRESS_FROM_COUNTRY_CODE,
                        phone: process.env.SHIPPING_ADDRESS_FROM_PHONE
                    };

                    internals
                        .getShippingRates(payload)
                        .then((response) => {
                            reply.apiSuccess(response);
                        })
                        .catch((err) => {
                            appInsightsClient.trackException({
                                exception: err
                            });
                            reply(Boom.badRequest(err));
                        });
                }
            }
        }
    ]);

    // server.expose('validateAddress', internals.validateAddress);
    return next();
};

exports.register.attributes = require('./package.json');
