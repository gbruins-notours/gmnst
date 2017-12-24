'use strict';

import forEach from 'lodash.foreach'
import isObject from 'lodash.isobject'
import ShoppingCartService from '../pages/cart/shopping_cart_service.js'

let shoppingCartService = new ShoppingCartService();


function clearShippingRatesCache(state) {
    state.app.shippingRatesCache.updated = null;
    state.app.shippingRatesCache.cache = null;
}


export default {
    TOGGLE_SIDEBAR: (state, opened) => {
        state.app.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.app.device.isMobile = device === 'mobile';
        state.app.device.isTablet = device === 'tablet';
    },

    // APP_INFO: (state, data) => {
    //     state.appInfo = decorateAppInfo(data);
    // },

    BRAINTREE_CLIENT_TOKEN: (state, token) => {
        state.app.braintreeClientToken = token
    },

    JWT_KEY: (state, key) => {
        state.app.jwtKey = key
    },

    IN_CHECKOUT_FLOW: (state, inCheckoutFlow) => {
        state.app.header.inCheckoutFlow = inCheckoutFlow
    },

    CART_SET: (state, cartData) => {
        forEach(cartData, (val, key) => {
            state.cart[key] = val;   
        });
    },

    CART_ATTRIBUTE_SET: (state, config) => {
        state.cart[config.attribute] = config.value || null;
    },

    CART_SET_SHIPPING_RATES_CACHE: (state, data) => {
        state.app.shippingRatesCache.updated = new Date().getTime();
        state.app.shippingRatesCache.cache = data;
    },

    CART_CLEAR_SHIPPING_RATES_CACHE: (state, data) => {
        clearShippingRatesCache(state);
    },

    CHECKOUT_CLEANUP: (state, data) => {
        state.cart = shoppingCartService.getCartDefaults();
        clearShippingRatesCache(state);
    }
}