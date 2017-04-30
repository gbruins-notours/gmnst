const Confidence = require('confidence');

const config = {
    $meta: 'This file configures the app.',
    port: {
        web: {
            $filter: 'env',
            test: 80,
            production: process.env.PORT,
            $default: process.env.PORT || 3000
        }
    }
};


const store = new Confidence.Store(config);

const criteria = {
    env: process.env.NODE_ENV
};

exports.get = function (key) {
    return store.get(key, criteria);
};

exports.meta = function (key) {
    return store.meta(key, criteria);
};