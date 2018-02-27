'use strict';

const ProductPicService = require('./ProductPicService')

export default class ProductPicVariantService extends ProductPicService {

    constructor(server) {
        super(server);

        if(server) {
            this.model = server.plugins.BookshelfOrm.bookshelf.model('ProductPicVariant');
        }
    }

}