import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import ShoppingCartService from '../pages/cart/shopping_cart_service.js'

let shoppingCartService = new ShoppingCartService();

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
                jwtKey: null,
                productInfo: {
                    subTypes: {
                        PRODUCT_SUBTYPE_HAT: 1,
                        PRODUCT_SUBTYPE_TOP: 2
                    },
                    seoUri: {
                        PRODUCT_SUBTYPE_HAT: 'hats',
                        PRODUCT_SUBTYPE_TOP: 'tops'
                    }
                }
            },

            // There seems to be an issue with reactivity in the UI
            // if state properties do not exist by default.  Defining these properties
            // that need to have immediate UI reactivity solves the issue
            cart: shoppingCartService.getCartDefaults()
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()]
    })
}
