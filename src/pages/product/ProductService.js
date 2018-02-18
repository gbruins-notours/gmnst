'use strict';

import queryString from 'query-string'
import _forEach from 'lodash.foreach'
import isObject from 'lodash.isobject'
import Promise from 'bluebird'
import { getHttp } from '../../util/http-common'


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

    getProductById(id, options) {
        let params = {};

        if(isObject(options)) {
            params = {
                ...options
            };
        }

        params.id = id;

        return getHttp()
            .get('/api/v1/product', {
                params
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
        let pic = null;

        if(Array.isArray(product.pics)) {
            let len = product.pics.length;

            if(product.featured_product_pic_id) {
                for(let i=0; i<len; i++) {
                    if(product.pics[i].is_visible && product.pics[i].id === product.featured_product_pic_id) {
                        pic = product.pics[i].file_name;
                        break;
                    }
                }
            }

            // If there isn't a featured pic set then just pick the first 'visible' one
            if(!pic) {
                for(let i=0; i<len; i++) {
                    if(product.pics[i].is_visible) {
                        pic = product.pics[i].file_name;
                        break;
                    }
                }
            }

            if(pic) {
                return this.getProductPicPath() + pic;
            }
        }

        return;
    }

    upsert(product) {
        let promise = null;
        let http = getHttp();
        let p = stripRelations(product);

        if(product.id) {
            promise = http.post(`/api/v1/product/update`, p)
        }
        else {
            promise = http.post(`/api/v1/product/create`, p)
        }

        return promise.then((response) => {
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

            if (Array.isArray(product.pics)) {
                // featured pic is always first
                if(product.featured_product_pic_id) {
                    product.pics.forEach((obj) => {
                        if (obj.is_visible && obj.file_name && obj.id === product.featured_product_pic_id) {
                            add(1, path + obj.file_name)
                        }
                    });
                }

                product.pics.forEach((obj) => {
                    if (obj.is_visible && obj.file_name) {
                        add(obj.sort_order, path + obj.file_name)
                    }
                });
            }

            resolve(getSortedArray(sortObj));
        });
    }
}