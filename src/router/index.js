import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const HomeView = () => System.import('../views/HomeView.vue')
const CounterView = () => System.import('../views/CounterView.vue')
const ApiDemo = () => System.import('../views/ApiDemo.vue')


export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/', component: HomeView },
            { path: '/counter', component: CounterView },
            { path: '/apidemo', component: ApiDemo }
        ]
    })
}
