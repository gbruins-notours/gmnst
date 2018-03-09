'use strict';


module.exports = class ProductSizeService {

    constructor(server) {
        this.server = server;
    }


    getModel() {
        return this.server.plugins.BookshelfOrm.bookshelf.model('ProductSize');
    }
}

