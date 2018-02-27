'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const isObject = require('lodash.isobject');
const cloneDeep = require('lodash.clonedeep');
const fileType = require('file-type');
const sharp = require('sharp');
const helperService = require('../../helpers.service');

const productDirectory = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../../dist/static/images/product/') //TODO: is this the right path?
    : path.join(__dirname, '../../../static/images/product/');
    

export default class ProductPicService {

    constructor(server) {
        if(server) {
            this.server = server;
            this.model = server.plugins.BookshelfOrm.bookshelf.model('ProductPic');
        }

        this.mageMimeTypeWhiteList = [
            'image/png',
            'image/gif',
            'image/jpeg',
            'image/pjpeg'
        ];
    }


    /**
     * Saves a new picture file
     * The new file name will be returned in the response if the file save was successful
     * otherwise the success response will be empty
     */
    saveFile(request, options) {
        let self = this;

        return new Promise((resolve, reject) => {
            if(request.payload.file) {
                let opts = isObject(options) ? options : {};
                let typeObj = self.fileIsImage(request.payload.file._data)

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
                    reject('File type must be one of: ' + self.imageMimeTypeWhiteList.join(','))
                }
            }  
            else {
                resolve();
            }
        });
    }


    /**
     * Deletes the product file if a new file is being sent in the request payload.
     * A successful file delete will then return the ProductPic in the response, 
     * otherwise the response will be empty.
     */
    deleteFileIfBeingReplaced(request) {
        let self = this;

        return new Promise((resolve, reject) => {
            // Delete the current product picture if an id is being passed (updating)
            // and a new file is being uploaded
            if(request.payload.id && request.payload.file) {
                self.model
                    .deleteFile(request.payload.id)
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


    deleteFile(id) {
        let self = this;

        return new Promise((resolve, reject) => {
            self.model
                .findById(id)
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
    }


    upsertProductPic(req, options) {
        let request = cloneDeep(req);
        let self = this;

        return this
            .deleteFileIfBeingReplaced(request)
            .catch((err) => {
                // just dropping the exception beacuse issues deleting the file
                // shouldn't stop this process from continuing
                console.log(err)
            })
            .then((productPic) => {
                return self.saveFile(request, options);
            })
            .then((saveFileResponse) => {
                // not needed when updatng the model:
                delete request.payload.file;

                if(isObject(saveFileResponse)) {
                    request.payload.file_name = saveFileResponse.file_name;
                    request.payload.width = saveFileResponse.width || null;
                    request.payload.height = saveFileResponse.height || null;
                }
               
                if(request.payload.id) {
                    return self.model.update(request.payload, { id: request.payload.id })
                }
                else {
                    return self.model.create(request.payload)
                }
            })
            .then((ProductPic) => {
                // Save variant
                // let productPicJson = ProductPic.toJSON();

                let args = {};
                args.product_id = ProductPic.get('product_id');
                args.product_pic_id = ProductPic.get('id');
                // todo...
            })
    }


    /**
     * Determines if the given file data is an appropriate mime type
     * 
     * @param {*} fileData  Most likely from request.payload.file._data
     */
    fileIsImage(fileData) {
        let typeObj = fileType(fileData);

        if(isObject(typeObj) && this.imageMimeTypeWhiteList.indexOf(typeObj.mime) > -1) {
            return typeObj;
        }

        return false;
    }
}