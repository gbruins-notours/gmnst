const CoreService = require('../../server/plugins/core/core.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        CoreService.DB_TABLES.products,
        (t) => {
            t.uuid('id').primary();
            t.string('title').nullable();
            t.text('description_short').nullable();
            t.text('description_long').nullable();
            t.string('sku').nullable();
            t.string('seo_uri').nullable();
            t.decimal('cost').nullable();
            t.decimal('weight_oz').nullable();
            t.decimal('base_price').nullable();
            t.decimal('sale_price').nullable();
            t.boolean('is_on_sale').nullable();
            t.boolean('is_available').nullable();
            t.string('tax_code').nullable();
            t.string('featured_pic').nullable();
            t.string('video_url').nullable();
            t.integer('gender').nullable();
            t.integer('type').nullable();
            t.integer('sub_type').nullable();
            t.integer('inventory_count').nullable();
            t.boolean('hide_if_out_of_stock').nullable();
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            // Foreign Keys:
            t.uuid('product_artist_id')
                .references('id')
                .inTable(CoreService.DB_TABLES.product_artists)
                .onDelete('CASCADE');

            t.index([
                'id',
                'product_artist_id',
                'type',
                'sub_type'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(CoreService.DB_TABLES.products);
};
