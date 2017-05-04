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
                }
            },
            appInfo: null,
            jwtKey: null
        },
        getters,
        mutations,
        actions,
        plugins: [createPersistedState()]
    })
}
