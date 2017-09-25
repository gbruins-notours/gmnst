import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

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
                clientToken: null,
                jwtKey: null
            },

            // There seems to be an issue with reactivity in the UI
            // if state properties do not exist by default.  Defining these properties
            // that need to have immediate UI reactivity solves the issue
            cart: {
                billingSameAsShipping: true,
                shipping_firstName: null,
                shipping_lastName: null,
                shipping_streetAddress: null,
                shipping_extendedAddress: null,
                shipping_company: null,
                shipping_city: null,
                shipping_state: null,
                shipping_postalCode: null,
                shipping_countryCodeAlpha2: null,
                shipping_email: null,
                billing_firstName: null,
                billing_lastName: null,
                billing_company: null,
                billing_streetAddress: null,
                billing_extendedAddress: null,
                billing_city: null,
                billing_state: null,
                billing_postalCode: null,
                billing_countryCodeAlpha2: null,
                billing_phone: null,
                num_items: 0
            }
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()]
    })
}
