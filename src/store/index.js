import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app from './modules/app'
import ui from './modules/ui'
import auth from './modules/auth'
import cart from './modules/cart'
import product from './modules/product'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        plugins: [createPersistedState()],
        modules: {
            app,
            ui,
            auth,
            cart,
            product
        }
    })
}
