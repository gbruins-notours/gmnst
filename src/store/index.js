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
            count: 0,
            jwtKey: null
        },
        actions,
        mutations,
        getters,
        plugins: [createPersistedState()]
    })
}
