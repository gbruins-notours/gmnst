import api from '../util/api';
import isObject from 'lodash.isobject'


export default {
    JWT_KEY: ({ commit }) => {
        return api.getToken().then((response) => {
            commit('JWT_KEY', response.headers['x-authorization'])
        })
    },

    APP_INFO: ({ commit }) => {
        return api.getInfo().then((data) => {
            commit('APP_INFO', data);
        })
    },

    IN_CHECKOUT_FLOW: ({ commit }, inCheckoutFlow) => {
        commit('IN_CHECKOUT_FLOW', inCheckoutFlow);
    },

    GET_ALL_PRODUCTS: ({ commit }) => {
        return api.getProducts(products => {
            commit('receiveProducts', { products });
        })
    },

    TOGGLE_SIDEBAR: ({ commit }, opened) => {
        commit('TOGGLE_SIDEBAR', opened);
    },

    TOGGLE_DEVICE: ({ commit }, device) => {
        commit('TOGGLE_DEVICE', device)
    },

    CART_ITEM_ADD: ({ commit }, data) => {
        return api.shoppingCart.addItem(data).then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_ITEM_SET_QTY: ({ commit }, data) => {
        return api.shoppingCart.updateItemQty(data).then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_ITEM_DELETE: ({ commit }, data) => {
        return api.shoppingCart.deleteItem(data).then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_SYNC: ({ commit }, data) => {
        return api.shoppingCart.getCart().then((cartData) => {
            console.log("CART", cartData);
            commit('CART_SET', cartData);
        })
    },

    CHECKOUT_SHIPPING_ATTRIBUTE: ({ commit }, config) => {
        if(isObject(config)
            && config.hasOwnProperty('attribute')
            && config.hasOwnProperty('value')) {
            commit('CHECKOUT_SHIPPING_ATTRIBUTE', config)
        }
    },

    CHECKOUT_BILLING_ATTRIBUTE: ({ commit }, config) => {
        if(isObject(config)
            && config.hasOwnProperty('attribute')
            && config.hasOwnProperty('value')) {
            commit('CHECKOUT_BILLING_ATTRIBUTE', config)
        }
    },

    CHECKOUT_BILLING_SAME_AS_SHIPPING: ({ commit }, sameAsShipping) => {
        commit('CHECKOUT_BILLING_SAME_AS_SHIPPING', sameAsShipping)
    }
}
