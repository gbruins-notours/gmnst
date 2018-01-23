'use strict';

const state = {
    app: {
        device: {
            isMobile: false,
            isTablet: false
        },
        header: {
            inCheckoutFlow: false
        },
        sidebar: {
            opened: false,
            hidden: false
        },
        braintreeClientToken: null,
        jwtKey: null,
        productInfo: {
            subTypes: {
                PRODUCT_SUBTYPE_HAT: 1,
                PRODUCT_SUBTYPE_TOP: 2
            },
            seoUri: {
                PRODUCT_SUBTYPE_HAT: 'hats',
                PRODUCT_SUBTYPE_TOP: 'tops'
            }
        }
    }
}
  
const mutations = {
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
  
const actions = {
    IN_CHECKOUT_FLOW: ({ commit }, inCheckoutFlow) => {
        commit('IN_CHECKOUT_FLOW', inCheckoutFlow);
    },

    TOGGLE_SIDEBAR: ({ commit }, opened) => {
        commit('TOGGLE_SIDEBAR', opened);
    },

    TOGGLE_DEVICE: ({ commit }, device) => {
        commit('TOGGLE_DEVICE', device)
    },

    JWT_KEY: ({ commit }, key) => {
        commit('JWT_KEY', key)
    },

    BRAINTREE_CLIENT_TOKEN: ({ commit }, token) => {
        commit('BRAINTREE_CLIENT_TOKEN', token)
    }
}
  
const getters = {
    app: (state) => {
        return state.app;
    },

    inCheckoutFlow: (state) => {
        return state.app.header.inCheckoutFlow;
    },

    sidebar: (state) => {
        return state.app.sidebar;
    },

    braintreeClientToken: (state) => {
        return state.app.braintreeClientToken;
    }
}
  
export default {
    state,
    mutations,
    getters,
    actions
}