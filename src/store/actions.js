'use strict';

export default {
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