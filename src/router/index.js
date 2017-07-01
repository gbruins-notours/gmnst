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
            {
                name: 'home',
                path: '/',
                component: Home
            },
            {
                name: 'product_list',
                path: '/type/:id',
                component: ProductList
            },
            {
                name: 'product_detail',
                path: '/item/:id',
                component: ProductDetail
            },
            {
                name: 'cart_checkout',
                path: '/cart/checkout',
                component: Checkout
            },
            {
                name: 'cart',
                path: '/cart/:id?',
                component: Cart
            },
            {
                name: 'error404',
                path: '*',
                component: Error404
            }
        ]
    })
}
