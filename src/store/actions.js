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
        let conf = Array.isArray(config) ? config : [config];

        conf.forEach((obj) => {
            if(isObject(obj) && 
                obj.hasOwnProperty('attribute') && 
                obj.hasOwnProperty('value')) {
                commit('CART_ATTRIBUTE_SET', obj)
            }
        });
    },

    CART_BILLING_SAME_AS_SHIPPING: ({ commit }, sameAsShipping) => {
        commit('CART_BILLING_SAME_AS_SHIPPING', sameAsShipping)
    },

    CART_SET_SHIPPING_RATES_CACHE: ({ commit }, data) => {
        commit('CART_SET_SHIPPING_RATES_CACHE', data)
    },

    CART_CLEAR_SHIPPING_RATES_CACHE: ({ commit }, data) => {
        commit('CART_CLEAR_SHIPPING_RATES_CACHE', data)
    },

    CHECKOUT_CLEANUP: ({ commit }) => {
        commit('CHECKOUT_CLEANUP')
    }
}