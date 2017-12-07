'use strict';

import isObject from 'lodash.isobject'

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

    TOGGLE_LOADING: ({ commit }, config) => {
        commit('TOGGLE_LOADING', config)
    },

    JWT_KEY: ({ commit }, key) => {
        commit('JWT_KEY', key)
    },

    BRAINTREE_CLIENT_TOKEN: ({ commit }, token) => {
        commit('BRAINTREE_CLIENT_TOKEN', token)
    },

    CART_SET: ({ commit }, data) => {
        commit('CART_SET', data)
    },

    CART_ATTRIBUTE_SET: ({ commit }, config) => {
        if(isObject(config) && 
            config.hasOwnProperty('attribute') && 
            config.hasOwnProperty('value')) {
            commit('CART_ATTRIBUTE_SET', config)
        }
    },

    CART_BILLING_SAME_AS_SHIPPING: ({ commit }, sameAsShipping) => {
        commit('CART_BILLING_SAME_AS_SHIPPING', sameAsShipping)
    },

    CART_SHIPPING_METHODS: ({ commit }, data) => {
        commit('CART_SHIPPING_METHODS', data)
    },

    CART_DELETE: ({ commit }) => {
        commit('CART_DELETE')
    }
}