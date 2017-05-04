const Path = require('path');
const testHelpers = require('../../testHelpers');


let manifest = testHelpers.getBasicManifest();
manifest.registrations.push(
    {
        plugin: {
            register: './plugins/products'
        }
    }
);


let composeOptions = {
    relativeTo: Path.resolve(__dirname, '../../../server')
};


module.exports.manifest = manifest;
module.exports.composeOptions = composeOptions;
