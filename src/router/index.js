import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const Home = () => System.import('../pages/Home.vue')
const Counter = () => System.import('../pages/Counter.vue')
const ApiDemo = () => System.import('../pages/ApiDemo.vue')


export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/', component: Home },
            { path: '/counter', component: Counter },
            { path: '/apidemo', component: ApiDemo }
        ]
    })
}
