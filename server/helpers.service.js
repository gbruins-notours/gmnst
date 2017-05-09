const Boom = require('boom');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const forEach = require('lodash.foreach');
const queryString = require('query-string');


function queryHelper(request) {
    let response = {
        pageSize: null,
        page: null,
        orderBy: null,
        orderDir: 'DESC',
        where: null,
        andWhere: null
    };

    let parsed = queryString.parse(request.url.search, {arrayFormat: 'bracket'});

    if(parsed.pageSize) {
        response.pageSize = parseInt(parsed.pageSize, 10) || null;
    }
    if(parsed.page) {
        response.page = parseInt(parsed.page, 10) || null;
    }
    if(parsed.orderDir == 'DESC' || parsed.orderDir == 'ASC') {
        response.orderDir = parsed.orderDir;
    }
    if(parsed.orderBy) {
        response.orderBy = parsed.orderBy;
    }
    if(parsed.where) {
        response.where = parsed.where;

        // and where:
        // andWhere: [ 'product_type_id,=,3', 'inventory_count,>,0' ]
        if(parsed.andWhere) {
            let andWhere = [];

            if(Array.isArray(parsed.andWhere)) {
                forEach(parsed.andWhere, (val) => {
                    if(isString(val)) {
                        val = val.split(',').map((item) => {
                            return item.trim()
                        });
                    }

                    if(Array.isArray(val) && val.length === 3) {
                        andWhere.push(val);
                    }
                });

                if(andWhere.length) {
                    response.andWhere = andWhere;
                }
            }
        }
    }

    return response;
}


function getBoomError(err, defaultError) {
    if(isObject(err) && err.isBoom) {
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