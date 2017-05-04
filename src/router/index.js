import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const HomeView = () => System.import('../views/Home.vue')
const ProductList = () => System.import('../views/product/ProductList.vue')
const ProductDetail = () => System.import('../views/product/ProductDetail.vue')
const Error404 = () => System.import('../views/Error404.vue')


export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/', component: HomeView },
            { path: '/type/:id', component: ProductList },
            { path: '/item/:id', component: ProductDetail },
            { path: '*', component: Error404 }
        ]
    })
}
