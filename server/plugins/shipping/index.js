const apiKey = process.env.NODE_ENV === 'development' ? process.env.SHIPPO_API_KEY_TEST : process.env.SHIPPO_API_KEY_PROD;
const shippo = require('shippo')(apiKey);
const isObject = require('lodash.isobject');

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
internals.validateAddress = (address) => {
    address.validate = true;
    return shippo.address.create(address);
}


exports.register = (server, options, next) => {
    server.expose('validateAddress', internals.validateAddress);
    return next();
};

exports.register.attributes = require('./package.json');
