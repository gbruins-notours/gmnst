'use strict';

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

    JWT_KEY: (state, key) => {
        state.app.jwtKey = key
    },

    IN_CHECKOUT_FLOW: (state, inCheckoutFlow) => {
        state.app.header.inCheckoutFlow = inCheckoutFlow
    },

    BRAINTREE_CLIENT_TOKEN: (state, token) => {
        state.app.braintreeClientToken = token
    }
}