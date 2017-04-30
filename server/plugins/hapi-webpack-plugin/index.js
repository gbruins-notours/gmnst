exports.register = (server, options, next) =>  {
    server.register(
        {
            register: require('hapi-webpack-plugin'),
            options: {
                compiler: options['compiler'],
                assets: options['webpack-dev-middleware'] || {},
                hot: options['webpack-hot-middleware'] || {}
            }
        },
        (err) => {
            if (err) {
                return next(err);
            }

            return next();
        }
    );
};

exports.register.attributes = require('./package.json');