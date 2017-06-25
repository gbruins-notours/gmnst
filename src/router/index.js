import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
// const Home = () => System.import('../pages/Home.vue')
// const ProductList = () => System.import('../pages/product/ProductList.vue')
// const ProductDetail = () => System.import('../pages/product/ProductDetail.vue')
// const Error404 = () => System.import('../pages/Error404.vue')

import Home from '../pages/Home.vue';
import ProductList from '../pages/product/ProductList.vue';
import ProductDetail from '../pages/product/ProductDetail.vue';
import Cart from '../pages/cart/Cart.vue';
import Checkout from '../pages/checkout/Checkout.vue';
import Error404 from '../pages/Error404.vue';

export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/', component: Home },
            { path: '/type/:id', component: ProductList },
            { path: '/item/:id', component: ProductDetail },
            { path: '/cart/:id', component: Cart }, //TODO: need route for optional :id
            { path: '/checkout', component: Checkout },
            { path: '*', component: Error404 }
        ]
    })
}
