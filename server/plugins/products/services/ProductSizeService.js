'use strict';


module.exports = class ProductSizeService {

    constructor(server) {
        this.server = server;
    }


    getModel() {
        return this.server.app.bookshelf.model('ProductSize');
    }
}

