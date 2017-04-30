import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from '@/store/actions'
import * as mutations from '@/store/mutations'
import state from '@/store/state'

Vue.use(Vuex)

export function getVM (component, store = {}) {
  return new Vue({
    el: document.createElement('div'),
    store,
    render: h => h(component, { ref: 'component' })
  }).$mount()
}

export function getMockedStore () {
  return new Vuex.Store({
    actions,
    mutations,
    state: JSON.parse(JSON.stringify(state))
  })
}
