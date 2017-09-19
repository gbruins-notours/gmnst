import api from '../util/api';
import isObject from 'lodash.isobject'


export default {
    JWT_KEY: ({ commit }) => {
        return api.getJwtToken().then((token) => {
            commit('JWT_KEY', token)
        })
    },

    GET_BRAINTREE_CLIENT_TOKEN: ({ commit }) => {
        return api.getBraintreeClientToken().then((response) => {
            commit('BRAINTREE_CLIENT_TOKEN', response)
        })
    },

    GET_PRODUCT_INFO: ({ commit }) => {
        return api.getProductInfo().then((response) => {
            commit('PRODUCT_INFO', response)
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

    CART_PULL: ({ commit }) => {
        return api.shoppingCart.getCart().then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    /**
     * Pushes the cart data in state to the server
     */
    CART_PUSH: ({ commit }) => {
        return api.shoppingCart.getCart().then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_SET: ({ commit }, cartData) => {
        commit('CART_SET', cartData);
    },

    CART_BILLING_ATTRIBUTE: ({ commit }, config) => {
        if(isObject(config) && 
            config.hasOwnProperty('attribute') && 
            config.hasOwnProperty('value')) {
            commit('CART_BILLING_ATTRIBUTE', config)
        }
    },

    CART_BILLING_SAME_AS_SHIPPING: ({ commit }, sameAsShipping) => {
        commit('CART_BILLING_SAME_AS_SHIPPING', sameAsShipping)
    },

    CART_SHIPPING_METHODS: ({ commit }, data) => {
        commit('CART_SHIPPING_METHODS', data)
    }
}
