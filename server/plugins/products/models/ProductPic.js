const CoreService = require('../../core/core.service');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const isObject = require('lodash.isobject');
const productService = require('../products.service');
const helperService = require('../../../helpers.service');

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
            /**
             * Saves a new picture file
             * The new file name will be returned in the response if the file save was successful
             * otherwise the success response will be empty
             */
            saveFile: function(request, options) {
                return new Promise((resolve, reject) => {
                    if(request.payload.file) {
                        let opts = isObject(options) ? options : {};
                        let typeObj = productService.fileIsImage(request.payload.file._data)
        
                        if(typeObj) {
                            if(!opts.file_name) {
                                opts.file_name = `${request.payload.product_id}_${new Date().getTime()}`
                            }

                            // clean and add the file extension:
                            opts.file_name = `${helperService.stripTags(helperService.stripQuotes(opts.file_name))}.${typeObj.ext}`;

                            let transformer = sharp()
                                .resize(opts.width || 600)
                                .on('info', function(info) {
                                    info.file_name = opts.file_name;
                                    global.logger.info('PRODUCT PIC - FILE SAVED', info);
                                    resolve(info);
                                });

                            request.payload.file.pipe(transformer).pipe(
                                fs.createWriteStream(productDirectory + opts.file_name)
                            );
                        }
                        else {
                            global.logger.info('SAVING PRODUCT FAILED BECAUSE WRONG MIME TYPE');
                            reject('File type must be one of: ' + productService.imageMimeTypeWhiteList.join(','))
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

            /**
             * Deletes the product file if a new file is being sent in the request payload.
             * A successful file delete will then return the ProductPic in the response, 
             * otherwise the response will be empty.
             */
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
