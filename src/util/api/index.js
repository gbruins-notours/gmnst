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
            // return HTTP
            //     .get('/api/v1/shipping/validateAddress', {
            //         params: address
            //     });
            return HTTP
                .get('/api/v1/shipping/validateAddress', {
                    params: address
                })
                .then((response) => {
                    return response.data.data;
                })
                .catch((error) => {
                    console.log("API CATCH", error.response);
                    return error;


                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                    //   console.log("RESPONSE DATA", error.response.data);
                    //   console.log("RESPONSE STATUS", error.response.status);
                    //   console.log(error.response.headers);
                        return error.response.data;
                    }
                    else {
                        return error.message;
                    }
                    // else if (error.request) {
                    //   // The request was made but no response was received
                    //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    //   // http.ClientRequest in node.js
                    //   console.log(error.request);
                    // } else {
                    //   // Something happened in setting up the request that triggered an Error
                    //   console.log('Error', error.message);
                    // }
                });
        },

        checkout(params) {
            return HTTP
                .post('/api/v1/cart/checkout', params)
                .then((response) => {
                    return response.data.data;
                });
        }

    }

};
