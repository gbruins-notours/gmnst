require('../../../../yaml_env');

const Path = require('path');
const testHelpers = require('../../testHelpers');


let manifest = testHelpers.getBasicManifest();
manifest.registrations.push(
    {
        plugin: {
            register: './plugins/shopping-cart'
        }
    },
    {
        plugin: {
            register: './plugins/products'
        }
    },
    {
        plugin: {
            register: './plugins/payments',
            options: {
                isSandbox: true,
                merchantId: process.env.BRAINTREE_MERCHANT_ID,
                publicKey: process.env.BRAINTREE_PUBLIC_KEY,
                privateKey: process.env.BRAINTREE_PRIVATE_KEY
            }
        }
    }
);


let composeOptions = {
    // Relative to the real hapi server
    relativeTo: Path.resolve(__dirname, '../../../../server')
};


module.exports.manifest = manifest;
module.exports.composeOptions = composeOptions;
