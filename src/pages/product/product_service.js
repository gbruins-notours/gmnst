'use strict';

import { getHttp } from '../../util/http-common';
import queryString from 'query-string'

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

    featuredProductPic(product) {
        if (product.featured_pic) {
            return '/static/images/product/' + product.featured_pic;
        }
        return;
    }
}