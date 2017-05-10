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
    },
    db: {
        $filter: 'env',
        production: {
            debug: false
        },
        $default: {
            debug: true
        }
    },
    mailgun: {
        $filter: 'env',
        production: {
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN_PROD
        },
        $default: {
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN
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