import { getHttp } from '../http-common';
import queryString from 'query-string'

export default {

    /**
     * Gets the JWT token.
     * Note the global "JWT_" variables used below are created
     * from the webpack "DefinePlugin"
     */
    getJwtToken() {
        return getHttp()
            .post('/api/v1/token/get', {
                clientId: JWT_CLIENT_ID,
                clientSecret: JWT_CLIENT_SECRET
            })
            .then((response) => {
                return response.headers['x-authorization'];
            });
    },

    getBraintreeClientToken() {
        return getHttp()
            .get('/api/v1/cart/token/get')
            .then((response) => {
                return response.data.data;
            });
    },

    getProductInfo() {
        return getHttp()
            .get('/api/v1/product/info')
            .then((response) => {
                return response.data.data;
            });
    },

    //TODO check for existance of this
    // getInfo() {
    //     return getHttp()
    //         .get('/api/v1/info')
    //         .then((response) => {
    //             return response.data.data;
    //         });
    // },

    logger(type, message) {
        if(message) {
            return getHttp().post('/api/v1/logger', {
                type: type || 'error',
                message: message
            });
        }
    },

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
    },

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
    },

    getProducts(params) {
        let paramString = queryString.stringify(params, {arrayFormat: 'bracket'});

        return getHttp()
            .get(`/api/v1/products?${paramString}`) // TODO: is there a XSS issue here?
            .then((response) => {
                return response.data.data;
            });
    },


    shoppingCart: {
        getCart() {
            return getHttp()
                .get('/api/v1/cart/get')
                .then((response) => {
                    return response.data.data;
                });
        },

        addItem(params) {
            return getHttp()
                .post('/api/v1/cart/item/add', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        updateItemQty(params) {
            return getHttp()
                .post('/api/v1/cart/item/qty', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        deleteItem(params) {
            return getHttp()
                .post('/api/v1/cart/item/remove', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        setShippingAddress(address) {
            return getHttp()
                .post('/api/v1/cart/shipping/setaddress', address)
                .then((response) => {
                    return response.data.data;
                });
        },

        validateAddress(address) {
            return getHttp()
                .post('/api/v1/shipping/validateAddress', address)
                .then((response) => {
                    return response.data.data;
                });
        },

        getShippingRates(params) {
            return getHttp()
                .post('/api/v1/shipping/rates', params)
                .then((response) => {
                    return response.data.data;
                });
        },

        checkout(params) {
            return getHttp()
                .post('/api/v1/cart/checkout', params)
                .then((response) => {
                    return response.data.data;
                });
        }
    }

    // salesTax: {
    //     getSalesTaxAmount(params) {
    //         return getHttp()
    //             .post('/api/v1/salestax/get', params)
    //             .then((response) => {
    //                 return response.data.data;
    //             });
    //     }
    // }
      
};
