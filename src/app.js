// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import { createStore } from './store'
import { createRouter } from './router'
import App from './App.vue'
import * as filters from './util/filters'
import VueI18n from 'vue-i18n';
import translations from './i18n';


Vue.config.productionTip = false;

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(VueI18n)
Vue.config.productionTip = false


// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp (ssrContext) {
    const i18n = new VueI18n(translations);

    // create store and router instances
    const store = createStore()
    const router = createRouter()

    // sync the router with the vuex store.
    // this registers `store.state.route`
    sync(store, router)

    // create the app instance.
    // here we inject the router, store and ssr context to all child components,
    // making them available everywhere as `this.$router` and `this.$store`.
    const app = new Vue({
        router,
        store,
        i18n,
        ssrContext,
        render: h => h(App)
    })

    // expose the app, the router and the store.
    // note we are not mounting the app here, since bootstrapping will be
    // different depending on whether we are in a browser or on the server.
    return { app, router, store }
}
