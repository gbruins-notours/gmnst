const Boom = require('boom');
const _ = require('lodash');


function getBoomError(err, defaultError) {
    if(_.isObject(err) && err.isBoom) {
        return err;
    }
    if(defaultError) {
        return defaultError;
    }
    return Boom.notFound(err);
}


function isDev() {
    return process.env.NODE_ENV === 'development';
}



module.exports.getBoomError = getBoomError;
module.exports.isDev = isDev;