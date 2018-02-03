'use strict';

import queryString from 'query-string'
import _forEach from 'lodash.foreach';
import Promise from 'bluebird';
import { getHttp } from '../../util/http-common';


function stripRelations(productJson) {
    delete productJson.artist;
    delete productJson.sizes;
    delete productJson.pics;

    // also strip uneditable values:
    delete productJson.created_at;
    delete productJson.updated_at;
    delete productJson.display_price;
    
    return productJson;
}


export default class ProductService {
    // constructor() {
    // }

    getProductInfo() {
        return getHttp()
            .get('/api/v1/product/info')
            .then((response) => {
                return response.data.data;
            });
    }
  
    getProductBySeoUri(str) {
        return getHttp()
            .get('/api/v1/product/seo', {
                params: {
                    id: str
                }
            })
            .then((response) => {
                return response.data.data;
            });
    }

    getProductById(id) {
        return getHttp()
            .get('/api/v1/product', {
                params: {
                    id
                }
            })
            .then((response) => {
                return response.data.data;
            });
    }

    getProducts(params) {
        let paramString = queryString.stringify(params, {arrayFormat: 'bracket'});

        return getHttp()
            .get(`/api/v1/products?${paramString}`) // TODO: is there a XSS issue here?
            .then((response) => {
                return response.data.data;
            });
    }

    getProductPicPath(fileName) {
        let base = '/static/images/product/';
        if(fileName) {
            return base + fileName;
        }
        return base;
    }

    featuredProductPic(product) {
        if (product.featured_pic) {
            return this.getProductPicPath() + product.featured_pic;
        }
        return;
    }

    update(product) {
        return getHttp()
            .post(`/api/v1/product/update`, stripRelations(product))
            .then((response) => {
                return response.data.data;
            });
    }

    buildPictures(product) {
        let sortObj = {};
        let added = [];

        function add(sortOrder, val) {
            let order = sortOrder || 100;

            if(added.indexOf(val) === -1) {
                added.push(val);
                
                if(!sortObj.hasOwnProperty(order)) {
                    sortObj[order] = [];
                }
    
                sortObj[order].push(val);
            }
        }

        function getSortedArray(sortObj) {
            let vals = [];

            _forEach(sortObj, (arr) => {
                if(Array.isArray(arr)) {
                    arr.forEach((val) => {
                        vals.push(val);
                    })
                }
            });

            return vals;
        }

        return new Promise((resolve, reject) => {
            let path = this.getProductPicPath();

            // featured pic is always first
            if(product.featured_pic) {
                add(1, path + product.featured_pic)
            }

            if (Array.isArray(product.pics)) {
                product.pics.forEach((obj) => {
                    if (obj.is_visible && obj.file_name) {
                        add(obj.sort_order, path + obj.file_name)
                    }
                });
            }

            resolve(getSortedArray(sortObj));
        });
    }

    buildSizeOptions(product) {
        return new Promise((resolve, reject) => {
            let sizeOpts = [];
            let maxInventoryCount = 0;

            if (Array.isArray(product.sizes)) {
                product.sizes.forEach((obj) => {
                    if (obj.is_visible && obj.inventory_count) {
                        sizeOpts.push(obj.size);

                        if (obj.inventory_count > maxInventoryCount) {
                            maxInventoryCount = obj.inventory_count;
                        }
                    }
                });
            }

            resolve({
                sizeOpts,
                maxInventoryCount
            });
        });
    }
}