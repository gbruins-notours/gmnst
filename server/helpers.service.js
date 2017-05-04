const Boom = require('boom');
const _ = require('lodash');


function queryHelper(query) {
    let andWhere = null;
    let response = {
        pageSize: null,
        page: null,
        orderBy: null,
        orderDir: 'DESC',
        where: null,
        andWhere: null
    };

    if(query.pageSize) {
        response.pageSize = parseInt(query.pageSize, 10) || null;
    }
    if(query.page) {
        response.page = parseInt(query.page, 10) || null;
    }
    if(query.orderDir == 'DESC' || query.orderDir == 'ASC') {
        response.orderDir = query.orderDir;
    }
    if(query.orderBy) {
        response.orderBy = query.orderBy;
    }

    // query.where format: ['propName', '=', 'value']
    if(_.isString(query.where) && query.where.length) {
        try {
            query.where = JSON.parse(query.where);
        }
        catch(error) {
            // just dropping it
        }
    }
    if(_.isArray(query.where) && query.where.length === 3) {
        response.where = query.where;
    }

    // query.andWhere format: [ ['propName1', '=', 'value1'], ['propName2', '=', 'value2'] ]
    if(query.andWhere) {
        andWhere = [];

        (function(parsed) {
            if(_.isArray(parsed)) {
                _.forEach(parsed, function(arr) {
                    if(_.isArray(arr) && arr.length === 3) {
                        andWhere.push(arr);
                    }
                });
            }
        }(JSON.parse(query.andWhere)));

        if(andWhere.length) {
            response.andWhere = andWhere;
        }
    }

    return response;
}


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



module.exports.queryHelper = queryHelper;
module.exports.getBoomError = getBoomError;
module.exports.isDev = isDev;