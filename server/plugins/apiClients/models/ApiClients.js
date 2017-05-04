'use strict';

const InfoService = require('../../info/info.service');

module.exports = function (baseModel, bookshelf) {
    return baseModel.extend({
        tableName: InfoService.DB_TABLES.api_clients,

        hasTimestamps: true
    });
};
