import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

// route-level code splitting
// const Home = () => System.import('../pages/Home.vue')
// const ProductList = () => System.import('../pages/product/ProductList.vue')
// const ProductDetail = () => System.import('../pages/product/ProductDetail.vue')
// const Error404 = () => System.import('../pages/Error404.vue')

import Home from '@/pages/Home.vue';
import ProductList from '@/pages/product/ProductList.vue';
import ProductDetail from '@/pages/product/ProductDetail.vue';
import Cart from '@/pages/cart/Cart.vue';
import Checkout from '@/pages/checkout/Checkout.vue';
import Order from '@/pages/orders/Order.vue';
import OrderDetails from '@/pages/orders/OrderDetails.vue';
import PrivacyNotice from '@/pages/PrivacyNotice.vue';
import ConditionsOfUse from '@/pages/ConditionsOfUse.vue';
import Returns from '@/pages/Returns.vue';
import Error404 from '@/pages/Error404.vue';

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
                path: '/type/:id/:itemId',
                component: ProductDetail
            },
            {
                name: 'checkout',
                path: '/cart/checkout',
                component: Checkout
            },
            {
                name: 'order',
                path: '/order/:id',
                component: Order
            },
            {
                name: 'order_details',
                path: '/order-details/:id',
                component: OrderDetails
            },
            {
                name: 'cart',
                path: '/cart/:id?',
                component: Cart
            },
            {
                name: 'privacy',
                path: '/privacy',
                component: PrivacyNotice
            },
            {
                name: 'conditions_of_use',
                path: '/conditions-of-use',
                component: ConditionsOfUse
            },
            {
                name: 'returns',
                path: '/returns',
                component: Returns
            },
            {
                name: 'error404',
                path: '*',
                component: Error404
            }
        ]
    })
}
