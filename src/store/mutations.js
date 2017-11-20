'use strict';

import cloneDeep from 'lodash.clonedeep'
import forEach from 'lodash.foreach'
import ShoppingCartService from '../pages/cart/shopping_cart_service.js'

let shoppingCartService = new ShoppingCartService();

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
        state.app.pageHeader.inCheckoutFlow = inCheckoutFlow
    },

    CART_SET: (state, cartData) => {
        forEach(cartData, (val, key) => {
            state.cart[key] = val;   
        });
    },

    CART_ATTRIBUTE_SET: (state, config) => {
        state.cart[config.attribute] = config.value || null;
    },

    CART_SHIPPING_METHODS: (state, data) => {
        state.cart.shippingMethods = data;
    },

    CART_DELETE: (state, data) => {
        state.cart = shoppingCartService.getCartDefaults();
    }
}