const Promise = require('bluebird');
const accounting = require('accounting');


let internals = {};


/**
 * Calculate the sales tax amount.
 * 
 * Pretty simple for now as we only have nexus in CA.
 * Returning a promise is overkill for now, but expecting that
 * we will eventually need to call a 3rd party service in the future
 * in which case a promise will be needed. This way the consumer 
 * won't need to change how they consume the function.
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
        return resolve(accounting.toFixed(taxAmount, 2));
    });
};


exports.register = (server, options, next) => {
    server.expose('getSalesTaxAmount', internals.getSalesTaxAmount);
    return next();
};

exports.register.attributes = require('./package.json');
