import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const Home = () => System.import('../pages/Home.vue')
const ProductList = () => System.import('../pages/product/ProductList.vue')
const ProductDetail = () => System.import('../pages/product/ProductDetail.vue')
const Error404 = () => System.import('../pages/Error404.vue')


export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/', component: Home },
            { path: '/type/:id', component: ProductList },
            { path: '/item/:id', component: ProductDetail },
            { path: '*', component: Error404 }
        ]
    })
}
