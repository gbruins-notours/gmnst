import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import checkoutService from '../util/checkoutService'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        state: {
            app: {
                device: {
                    isMobile: false,
                    isTablet: false
                },
                sidebar: {
                    opened: false,
                    hidden: false
                },
                pageHeader: {
                    inCheckoutFlow: false
                },
                braintreeClientToken: null,
                jwtKey: null
            },

            // There seems to be an issue with reactivity in the UI
            // if state properties do not exist by default.  Defining these properties
            // that need to have immediate UI reactivity solves the issue
            cart: checkoutService.getCartDefaults()
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()]
    })
}
