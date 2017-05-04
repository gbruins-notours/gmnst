import { HTTP } from '../http-common';

export default {

    getToken() {
        return HTTP.post('/api/v1/token/get', {
            clientId: 'admin@gmnst.com',
            clientSecret: 'G244.h"eSjV/'
        });
    },

    getInfo() {
        return HTTP.get(`/api/v1/info`).then((response) => {
            return response.data.data;
        });
    },

    getProduct(id) {
        return HTTP.get(`/api/v1/product/${id}`).then((response) => {
            return response.data.data;
        });
    },

    getProducts(params) {
        return HTTP
            .get(`/api/v1/products`, { params })
            .then((response) => {
                return response.data.data;
            });
    },

    buyProducts(products, cb, errorCb) {
        setTimeout(() => {
            // simulate random checkout failure.
            (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
                ? cb()
                : errorCb()
        }, 100)
    }
};
