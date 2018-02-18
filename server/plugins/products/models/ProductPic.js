const CoreService = require('../../core/core.service');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const isObject = require('lodash.isobject');
const fileType = require('file-type');

const productDirectory = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../../dist/static/images/product/') //TODO: is this the right path?
    : path.join(__dirname, '../../../../static/images/product/');


module.exports = function (baseModel, bookshelf) {
    return baseModel.extend(
        {
            tableName: CoreService.DB_TABLES.product_pics,

            uuid: true,

            hasTimestamps: true,

            // One-to-One relation with Product
            // product_id is the foreign key in this model
            product: function() {
                return this.belongsTo('Product', 'product_id');
            }
        },

        // Custom methods:
        {
            saveFile: function(request) {
                return new Promise((resolve, reject) => {
                    if(request.payload.file) {
                        let mimeTypeWhiteList = [
                            'image/png',
                            'image/gif',
                            'image/jpeg',
                            'image/pjpeg'
                        ];
        
                        let typeObj = fileType(request.payload.file._data);
        
                        if(isObject(typeObj) && mimeTypeWhiteList.indexOf(typeObj.mime) > -1) {
                            let newFileName = `${request.payload.product_id}_${new Date().getTime()}.${typeObj.ext}`;
                            request.payload.file.pipe(
                                fs.createWriteStream(productDirectory + newFileName)
                            )

                            global.logger.info('PRODUCT PIC - FILE SAVED', newFileName);
                            resolve(newFileName);
                        }
                        else {
                            global.logger.info('SAVING PRODUCT FAILED BECAUSE WRONG MIME TYPE', typeObj.mime);
                            reject('File type must be one of: ' + mimeTypeWhiteList.join(','))
                        }
                    }  
                    else {
                        resolve();
                    }
                });
            },

            deleteFile: function(id) {
                return new Promise((resolve, reject) => {
                    this.findById(id)
                        .then((ProductPic) => {
                            if(!ProductPic) {
                                global.logger.error('PRODUCT PIC - UNABLE TO FIND DB ENTRY', id);
                                reject('Unable to find product picture.')
                                return;
                            }
        
                            let fileName = ProductPic.get('file_name');
        
                            if(fileName) {
                                fs.unlink(productDirectory + fileName, (err) => {
                                    if(err) {
                                        global.logger.error('PRODUCT PIC - ERROR DELETING FILE', err);
                                        return reject(err);
                                    }
        
                                    global.logger.info('PRODUCT PIC - FILE DELETED', fileName);
                                    return resolve(ProductPic);
                                });
                            }  
                            else {
                                return resolve(ProductPic);
                            }
                        });
                });
            },

            deleteFileIfBeingReplaced: function(request) {
                let self = this;

                return new Promise((resolve, reject) => {
                    // Delete the current product picture if an id is being passed (updating)
                    // and a new file is being uploaded
                    if(request.payload.id && request.payload.file) {
                        self.deleteFile(request.payload.id)
                            .then((ProductPic) => {
                                return resolve(ProductPic.toJSON())
                            })
                            .catch((err) => {
                                return reject(err);
                            })
                    }
                    else {
                        resolve()
                    }
                });
            }
        }
    );
};
