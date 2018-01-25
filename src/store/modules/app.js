'use strict';

const state = {
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
    jwtKey: null
}
  
const mutations = {
    TOGGLE_SIDEBAR: (state, opened) => {
        state.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.device.isMobile = device === 'mobile';
        state.device.isTablet = device === 'tablet';
    },

    // APP_INFO: (state, data) => {
    //     state.appInfo = decorateAppInfo(data);
    // },

    JWT_KEY: (state, key) => {
        state.jwtKey = key
    },

    IN_CHECKOUT_FLOW: (state, inCheckoutFlow) => {
        state.header.inCheckoutFlow = inCheckoutFlow
    },

    BRAINTREE_CLIENT_TOKEN: (state, token) => {
        state.braintreeClientToken = token
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
    jwtKey: (state) => {
        return state.jwtKey;
    },

    inCheckoutFlow: (state) => {
        return state.header.inCheckoutFlow;
    },

    sidebar: (state) => {
        return state.sidebar;
    },

    braintreeClientToken: (state) => {
        return state.braintreeClientToken;
    }
}
  
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}