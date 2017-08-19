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
            .get('/api/v1/info')
            .then((response) => {
                return response.data.data;
            });
    },

    logger(type, message) {
        if(message) {
            return HTTP.post('/api/v1/logger', {
                type: type || 'error',
                message: message
            });
        }
    },

    getProductById(id) {
        return HTTP
            .get('/api/v1/product', {
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
            .get('/api/v1/product/seo', {
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
        getCart() {
            return HTTP
                .get('/api/v1/cart/get')
                .then((response) => {
                    return response.data.data;
                });
        },

        addItem(params) {
            return HTTP
                .post('/api/v1/cart/item/add', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        updateItemQty(params) {
            return HTTP
                .post('/api/v1/cart/item/qty', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        deleteItem(params) {
            return HTTP
                .post('/api/v1/cart/item/remove', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        validateAddress(address) {
            return HTTP
                .post('/api/v1/shipping/validateAddress', address)
                .then((response) => {
                    return response.data.data;
                });
        },

        getShippingRates(params) {
            return HTTP
                .post('/api/v1/shipping/rates', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        checkout(params) {
            return HTTP
                .post('/api/v1/cart/checkout', params)
                .then((response) => {
                    return response.data.data;
                });
        }
    },

    salesTax: {
        getSalesTaxAmount(params) {
            return HTTP
                .post('/api/v1/salestax/get', params)
                .then((response) => {
                    return response.data.data;
                });
        }
    }
    
};
