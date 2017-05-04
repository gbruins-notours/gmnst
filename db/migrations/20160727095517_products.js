const InfoService = require('../../server/plugins/info/info.service');


module.exports.up = (knex) => {
    return knex.schema.createTable(
        InfoService.DB_TABLES.products,
        (t) => {
            t.increments('id');
            t.string('title').nullable();
            t.text('description_short').nullable();
            t.text('description_long').nullable();
            t.string('sku').nullable();
            t.string('seo_uri').nullable();
            t.decimal('cost').nullable();
            t.decimal('base_price').nullable();
            t.decimal('sale_price').nullable();
            t.boolean('is_on_sale').nullable();
            t.boolean('is_available').nullable();
            t.string('tax_code').nullable();
            t.string('featured_pic').nullable();
            t.string('video_url').nullable();
            t.integer('inventory_count').nullable();
            t.boolean('hide_if_out_of_stock').nullable();
            t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            t.dateTime('updated_at').nullable();

            // Foreign Keys:
            t.integer('product_artist_id')
                .references('id')
                .inTable( InfoService.DB_TABLES.product_artists )
                .onDelete('CASCADE');

            t.integer('product_category_id')
                .references('id')
                .inTable( InfoService.DB_TABLES.product_categories )
                .onDelete('CASCADE');

            t.integer('product_type_id')
                .references('id')
                .inTable( InfoService.DB_TABLES.product_types )
                .onDelete('CASCADE');

            t.index([
                'id',
                'product_artist_id',
                'product_category_id',
                'product_type_id'
            ]);
        }
    );
};


module.exports.down = (knex) => {
    return knex.schema.dropTableIfExists(InfoService.DB_TABLES.products);
};
