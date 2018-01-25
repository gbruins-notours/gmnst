'use strict';

const state = {
    subTypes: {
        PRODUCT_SUBTYPE_HAT: 1,
        PRODUCT_SUBTYPE_TOP: 2
    },
    seoUri: {
        PRODUCT_SUBTYPE_HAT: 'hats',
        PRODUCT_SUBTYPE_TOP: 'tops'
    }
}
  
const mutations = {

}
  
const actions = {

}
  
const getters = {
    subTypes: (state) => {
        return state.subTypes;
    },
    seoUri: (state) => {
        return state.seoUri;
    }
}
  
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}