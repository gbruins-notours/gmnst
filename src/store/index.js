import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import ShoppingCartService from '../pages/cart/shopping_cart_service.js'
import auth from './modules/auth'
import cart from './modules/cart'

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
                header: {
                    inCheckoutFlow: false
                },
                sidebar: {
                    opened: false,
                    hidden: false
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
            }
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()],
        modules: {
            auth,
            cart
        }
    })
}
