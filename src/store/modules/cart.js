'use strict';

import isObject from 'lodash.isobject'
import forEach from 'lodash.foreach'
import ShoppingCartService from '@/pages/cart/shopping_cart_service.js'

let shoppingCartService = new ShoppingCartService();

function clearShippingRatesCache(state) {
    state.shippingRatesCache.updated = null;
    state.shippingRatesCache.cache = null;
}


const state = {
    // There seems to be an issue with reactivity in the UI
    // if state properties do not exist by default.  Defining these properties
    // that need to have immediate UI reactivity solves the issue
    cart: shoppingCartService.getCartDefaults(),
    shippingRatesCache: {
        updated: null,
        cache: null
    }
}
  
const mutations = {
    CART_SET: (state, cartData) => {
        forEach(cartData, (val, key) => {
            state.cart[key] = val;   
        });
    },

    CART_ATTRIBUTE_SET: (state, config) => {
        state.cart[config.attribute] = config.value || null;
    },

    CART_SET_SHIPPING_RATES_CACHE: (state, data) => {
        state.shippingRatesCache.updated = new Date().getTime();
        state.shippingRatesCache.cache = data;
    },

    CART_CLEAR_SHIPPING_RATES_CACHE: (state, data) => {
        clearShippingRatesCache(state);
    },

    CHECKOUT_CLEANUP: (state, data) => {
        state.cart = shoppingCartService.getCartDefaults();
        clearShippingRatesCache(state);
    }
}
  
const actions = {
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
  
const getters = {
    cart: (state) => {
        return state.cart;
    },

    numCartItems: (state) => {
        return state.cart.num_items || 0;
    },

    cartShippingAttributes: (state) => {
        let attrs = {};

        Object.keys(state.cart).forEach((key) => {
            if(key.indexOf('shipping_') === 0) {
                attrs[key] = state.cart[key]
            }
        });

        return attrs;
    },

    cartBillingAttributes: (state) => {
        let attrs = {};

        Object.keys(state.cart).forEach((key) => {
            if(key.indexOf('billing_') === 0) {
                attrs[key] = state.cart[key]
            }
        });
        
        return attrs;
    },

    getShippingRateCache: (state) => {
        return state.shippingRatesCache;
    }
}
  
export default {
    state,
    mutations,
    getters,
    actions
}