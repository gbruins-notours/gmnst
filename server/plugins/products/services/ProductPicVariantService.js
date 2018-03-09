'use strict';

const Promise = require('bluebird');



module.exports = class ProductPicVariantService {

    constructor(server) {
        this.server = server;
    }


    getModel() {
        return this.server.plugins.BookshelfOrm.bookshelf.model('ProductPicVariant');
    }


    deleteVariants(ProductPic) {
        let self = this;

        return new Promise((resolve, reject) => {
            if(ProductPic) {
                let json = ProductPic.toJSON();

                if(Array.isArray(json.pic_variants)) {
                    json.pic_variants.forEach((obj) => {
                        global.logger.info('DELETING PRODUCT PIC VARIANT FROM DB', obj.id);

                        self.getModel()
                            .destroy({
                                id: obj.id
                            })
                            .then(() => {
                                resolve();
                            });
                    });
                }
                else {
                    resolve();
                }
            }
            else {
                resolve();
            }
        });
    }

}