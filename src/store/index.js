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
                }
            },
            // appInfo: {
            //     product: {
            //         subTypes: []
            //     }
            // },
            cart: {},
            checkout: {
                shipping: {
                    firstName: null,
                    lastName: null,
                    streetAddress: null,
                    extendedAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null,
                    company: null,
                    email: null,
                },
                billing: {
                    firstName: null,
                    lastName: null,
                    streetAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null,
                    company: null
                },
                billingSameAsShipping: true
            }
            // jwtKey: null
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()]
    })
}
