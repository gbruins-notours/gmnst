'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const isObject = require('lodash.isobject');
const cloneDeep = require('lodash.clonedeep');
const fileType = require('file-type');
const sharp = require('sharp');
const helperService = require('../../../helpers.service');
const ProductPicVariantService = require('./ProductPicVariantService');

const productDirectory = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../../dist/static/images/product/') //TODO: is this the right path?
    : path.join(__dirname, '../../../../static/images/product/');

const imageMimeTypeWhiteList = [
    'image/png',
    'image/gif',
    'image/jpeg',
    'image/pjpeg'
];


function fileIsImage(fileData) {
    let typeObj = fileType(fileData);

    if(isObject(typeObj) && imageMimeTypeWhiteList.indexOf(typeObj.mime) > -1) {
        return typeObj;
    }

    return false;
}


function deleteFile(fileName) {
    return new Promise((resolve, reject) => {
        if(!fileName) {
            return reject('Can not delete file because fileName was not provided');
        }

        fs.unlink(productDirectory + fileName, (err) => {
            if(err) {
                return reject(err);
            }

            resolve()
        });
    });
}


/**
 * Saves a new picture file
 * The new file name will be returned in the response if the file save was successful
 * otherwise the success response will be empty
 */
function resizeAndWrite(req, width) {
    // Cloning is necessary because the file.pipe operation below seems
    // to modify the request.payload.file value, causing subsequest
    // resize attemtps on the same file to fail.
    let request = cloneDeep(req);

    return new Promise((resolve, reject) => {
        if(request.payload.file) {
            let typeObj = fileIsImage(request.payload.file._data)

            if(typeObj) {
                let w = parseInt(width, 10) || 600
                let cleanId = helperService.stripTags(helperService.stripQuotes(request.payload.product_id));
                let fileName = `${cleanId}_${new Date().getTime()}.${typeObj.ext}`;

                let transformer = sharp()
                    .resize(w)
                    .max()
                    .withoutEnlargement(true)
                    .on('info', function(info) {
                        info.file_name = fileName;
                        return resolve(info);
                    });

                request.payload.file.pipe(transformer).pipe(
                    fs.createWriteStream(productDirectory + fileName)
                );
            }
            else {
                global.logger.info('SAVING PRODUCT FAILED BECAUSE WRONG MIME TYPE');
                return reject('File type must be one of: ' + imageMimeTypeWhiteList.join(','))
            }
        }  
        else {
            resolve();
        }
    });
}



module.exports = class ProductPicService {

    constructor(server) {
        this.server = server;
        this.productPicVariantService = new ProductPicVariantService(server);
    }


    getModel() {
        return this.server.app.bookshelf.model('ProductPic')
    }


    /**
     * Deletes the product file if a new file is being sent in the request payload.
     * A successful file delete will then return the ProductPic in the response, 
     * otherwise the response will be empty.
     */
    unlinkFileAndVariantsIfBeingReplaced(request) {
        let self = this;

        return new Promise((resolve, reject) => {
            // Delete the current product picture if an id is being passed (updating)
            // and a new file is being uploaded
            if(request.payload.id && request.payload.file) {
                self.unlinkFileAndVariants(request.payload.id)
                    .then((ProductPic) => {
                        return resolve(ProductPic)
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


    /**
     * Deletes a file from the file system, and does the same
     * with any variants this file may have
     * 
     * @param {*} id 
     * @returns {ProductPic}  Returns the ProductPic model
     */
    unlinkFileAndVariants(id) {
        let self = this;

        return new Promise((resolve, reject) => {
            // Query the DB to get the file name of the pic
            // and all of the pics variants
            self.getModel()
                .findById(id, {
                    withRelated: ['pic_variants']
                })
                .then((ProductPic) => {
                    if(!ProductPic) {
                        global.logger.error('PRODUCT PIC - UNABLE TO FIND DB ENTRY', id);
                        reject('Unable to find product picture.')
                        return;
                    }
                    
                    let json = ProductPic.toJSON();
                    global.logger.info('PRODUCT PIC WITH VARIANTS', json)

                    if(json.file_name) {
                        // Unlink the main product pic
                        deleteFile(json.file_name)
                            .then(() => {
                                global.logger.info('PRODUCT PIC - FILE DELETED', json.file_name);
                            })
                            .catch((err) => {
                                global.logger.error('PRODUCT PIC - ERROR DELETING FILE', err);
                            });

                        // Unlink the product pic variants
                        if(Array.isArray(json.pic_variants)) {
                            json.pic_variants.forEach((obj) => {
                                deleteFile(obj.file_name)
                                    .then(() => {
                                        global.logger.info('PRODUCT PIC VARIANT - FILE DELETED', obj.file_name);
                                    })
                                    .catch((err) => {
                                        global.logger.error('PRODUCT PIC VARIANT - ERROR DELETING FILE', err);
                                    });
                            });
                        }

                        return resolve(ProductPic);
                    }  
                    else {
                        return resolve(ProductPic);
                    }
                });
        });
    }


    /*
     * Upserts and resizes a standard product pic as well as its larger variant
     * @param {*} req 
     * @param {*} options 
     */
    upsertProductPic(request, options) {
        let self = this;

        return new Promise((resolve, reject) => {
            let productPic;

            this.unlinkFileAndVariantsIfBeingReplaced(request)
                .catch((err) => {
                    // just dropping the exception beacuse issues deleting the file
                    // shouldn't stop this process from continuing
                    global.logger.error('ERROR UNLINKING FILE', err)
                })
                .then((ProductPic) => {
                    // Always delete the variants and re-create
                    self.productPicVariantService.deleteVariants(ProductPic)
                    return resizeAndWrite(request, 600)
                })
                .then((resizeResponse) => {
                    global.logger.info('PRODUCT PIC - FILE RESIZED (600)', resizeResponse);

                    // update or create the ProductPic
                    let model = self.getModel();
                    let payload = cloneDeep(request.payload);

                    delete payload.file; // not needed when updatng the model

                    // resizeResponse will be empty if the HTTP request did not include a file
                    // (which it may not if the user in only updating other attributes)
                    if(isObject(resizeResponse)) {
                        // Additional data needed for the ProductPic model
                        payload.file_name = resizeResponse.file_name;
                        payload.width = resizeResponse.width || null;
                        payload.height = resizeResponse.height || null;
                    }

                    if(payload.id) {
                        return model.update(payload, { id: payload.id });
                    }
                    else {
                        return model.create(payload);
                    }
                })
                .then((ProductPic) => {
                    productPic = ProductPic;
                    global.logger.info('PRODUCT PIC UPSERTED', productPic.get('id'));

                    // ProductPicVariant:
                    return resizeAndWrite(request, 1000)
                })
                .then((resizeResponse) => {
                    global.logger.info('PRODUCT PIC VARIANT - FILE RESIZED (1000)', resizeResponse);

                    let payload = cloneDeep(request.payload);
                    delete payload.file;
                    delete payload.product_id;
                    delete payload.sort_order;
                    delete payload.id;
    
                    if(isObject(resizeResponse)) {
                        payload.file_name = resizeResponse.file_name;
                        payload.width = resizeResponse.width || null;
                        payload.height = resizeResponse.height || null;
                    }
                    
                    payload.product_pic_id = productPic.get('id');

                    global.logger.info('PRODUCT PIC VARIANT - CREATING', payload);

                    return self.productPicVariantService.getModel().create(payload);
                })
                .then((ProductPicVariant) => {
                    global.logger.info('PRODUCT PIC VARIANT- CREATED', ProductPicVariant.get('product_pic_id'));
                    return resolve(ProductPicVariant.get('product_pic_id'))
                })
                .catch((err) => {
                    global.logger.info('ERROR FROM UPSERT PRODUCT PIC', err)
                    return reject(err);
                });
        });
    }
}