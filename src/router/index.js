import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

// route-level code splitting
const Home = () => System.import('@/pages/Home')
const ProductList = () => System.import('@/pages/product/ProductList')
const ProductDetail = () => System.import('@/pages/product/ProductDetail')
const Cart = () => System.import('@/pages/cart/Cart')
const Checkout = () => System.import('@/pages/checkout/Checkout')
const Order = () => System.import('@/pages/orders/Order')
const OrderDetails = () => System.import('@/pages/orders/OrderDetails')
const PrivacyNotice = () => System.import('@/pages/PrivacyNotice')
const ConditionsOfUse = () => System.import('@/pages/ConditionsOfUse')
const Returns = () => System.import('@/pages/Returns')
const Error404 = () => System.import('@/pages/Error404')

// Admin pages
const Login = () => System.import('@/pages/admin/Login.vue')
const AdminHome = () => System.import('@/pages/admin/AdminHome.vue')
const AdminProducts = () => System.import('@/pages/admin/AdminProducts.vue')
const AdminReports = () => System.import('@/pages/admin/AdminReports.vue')


// import Home from '@/pages/Home'
// import ProductList from '@/pages/product/ProductList'
// import ProductDetail from '@/pages/product/ProductDetail'
// import Cart from '@/pages/cart/Cart'
// import Checkout from '@/pages/checkout/Checkout'
// import Order from '@/pages/orders/Order'
// import OrderDetails from '@/pages/orders/OrderDetails'
// import PrivacyNotice from '@/pages/PrivacyNotice'
// import ConditionsOfUse from '@/pages/ConditionsOfUse'
// import Returns from '@/pages/Returns'
// import Error404 from '@/pages/Error404'

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
            },

            // Admin Routes
            {
                name: 'adminHome',
                path: '/acts',
                component: AdminHome
            },
            {
                name: 'login',
                path: '/acts/login',
                component: Login
            },
            {
                name: 'adminProducts',
                path: '/acts/products',
                component: AdminProducts
            },
            {
                name: 'adminReports',
                path: '/acts/reports',
                component: AdminReports
            }
        ]
    })
}
