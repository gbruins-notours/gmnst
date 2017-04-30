
let internals = {};

internals.after = function (server, next) {
    server.route([
        {
            method: 'GET',
            path: '/hello',
            config: {
                description: 'Demo route for API requests',
                handler: (request, reply) => {
                    reply({
                        message: 'Hello!'
                    })
                }
            }
        }
    ]);
};


exports.register = (server, options, next) => {
    internals.after(server, next);
    return next();
};

exports.register.attributes = require('./package.json');