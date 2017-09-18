const Joi = require('joi');
const Boom = require('boom');
const Promise = require('bluebird');
const accounting = require('accounting');

let internals = {};

/**
 * Calculate the sales tax amount.
 * Pretty simple for now as we only have nexus in CA.
 * 
 * https://blog.taxjar.com/sales-tax-and-shipping/
 */
internals.getSalesTaxAmount = (params) => {
    return new Promise((resolve, reject) => {
        let taxAmount = 0;

        if(params.countryCodeAlpha2 === 'US' && params.sub_total) {
            switch(params.state) {
                case 'CA':
                    // NOTE: shipping is not taxable in CA
                    taxAmount = parseFloat(params.sub_total) * parseFloat(process.env.TAX_RATE_CALIFORNIA || '0.09');
                    break;

                default:
            }
        }

        // accounting.toFixed returns a string, so converting to float:
        return resolve(parseFloat(accounting.toFixed(taxAmount, 2)));
    });
};


exports.register = (server, options, next) => {

    // server.route([
    //     {
    //         method: 'POST',
    //         path: '/salestax/get',
    //         config: {
    //             description: 'Returns the sales tax amount for the given address and subtotal',
    //             validate: {
    //                 payload: {
    //                     city: Joi.string().trim().max(255).required(),
    //                     state: Joi.string().trim().max(255).required(),
    //                     countryCodeAlpha2: Joi.string().max(2).regex(/^[A-z]+$/).required(),
    //                     sub_total: Joi.number().precision(2).positive().max(99999999.99).required(),
    //                     shipping: Joi.number().precision(2).positive().max(99999999.99)
    //                 }
    //             },
    //             handler: (request, reply) => {
    //                 internals
    //                     .getSalesTaxAmount(request.payload)
    //                     .then((response) => {
    //                         reply.apiSuccess(response);
    //                     })
    //                     .catch((err) => {
    //                         reply(Boom.badRequest(err));
    //                     });
    //             }
    //         }
    //     }
    // ]);


    server.expose('getSalesTaxAmount', internals.getSalesTaxAmount);

    return next();
};

exports.register.attributes = require('./package.json');
