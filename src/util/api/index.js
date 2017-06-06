import { HTTP } from '../http-common';
import queryString from 'query-string'

export default {

    getToken() {
        return HTTP.post('/api/v1/token/get', {
            clientId: 'admin@gmnst.com',
            clientSecret: 'G244.h"eSjV/'
        });
    },

    getInfo() {
        return HTTP
            .get(`/api/v1/info`)
            .then((response) => {
                return response.data.data;
            });
    },

    getProductById(id) {
        return HTTP
            .get(`/api/v1/product`, {
                params: {
                    id
                }
            })
            .then((response) => {
                return response.data.data;
            });
    },

    getProductBySeoUri(str) {
        return HTTP
            .get(`/api/v1/product/seo`, {
                params: {
                    id: str
                }
            })
            .then((response) => {
                return response.data.data;
            });
    },

    getProducts(params) {
        let paramString = queryString.stringify(params, {arrayFormat: 'bracket'});

        return HTTP
            .get(`/api/v1/products?${paramString}`) // TODO: is there a XSS issue here?
            .then((response) => {
                return response.data.data;
            });
    },


    shoppingCart: {

        // TODO:
        // getCart(params) {
        //     return HTTP
        //         .get(`/api/v1/products?${paramString}`)
        //         .then((response) => {
        //             return response.data.data;
        //         });
        // },

        addItem(params) {
            return HTTP
                .post(`/api/v1/cart/item/add`, params)
                .then((response) => {
                    return response.data.data;
                });
        }

    }

};
