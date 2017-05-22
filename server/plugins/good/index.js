const Hoek = require('hoek');
const Path = require('path');


exports.register = (server, options, next) =>  {

    let defaultOpts = {
        ops: {
            interval: 10000
        },
        reporters: {
            consoleReporter: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ],
            // opsReporter: [
            //     {
            //         module: 'good-squeeze',
            //         name: 'Squeeze',
            //         args: [{ ops: '*'}]
            //     },
            //     {
            //         module: 'good-squeeze',
            //         name: 'SafeJson'
            //     },
            //     {
            //         module: 'good-file',
            //         args: [
            //             Path.join(__dirname, '../../logs/ops.log')
            //         ]
            //     }
            // ],
            errorReporter: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ error: '*'}]
                },
                {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                },
                {
                    module: 'good-file',
                    args: [
                        Path.join(__dirname, '../../logs/error.log')
                    ]
                }
            ]
        }
    };

    server.register(
        {
            register: require('good'),
            options: Hoek.applyToDefaults(defaultOpts, options)
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
