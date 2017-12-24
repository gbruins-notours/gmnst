const CoreService = require('../../server/plugins/core/core.service');

module.exports.up = function(knex) {
    knex.schema.table(CoreService.DB_TABLES.carts, function(t) {
        t.dropColumn('shipping_total');
    })
};

module.exports.down = function(knex) {
    knex.schema.table(CoreService.DB_TABLES.carts, function(t) {
        t.decimal('shipping_total').nullable();
    })
};