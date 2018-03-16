'use strict';

const state = {
    header: {
        inCheckoutFlow: false
    },
    braintreeClientToken: null,
    jwtKey: null
}
  
const mutations = {
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