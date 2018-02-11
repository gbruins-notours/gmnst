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
const Login = () => System.import('@/pages/admin/Login')
const AdminHome = () => System.import('@/pages/admin/AdminHome')
const AdminProductList = () => System.import('@/pages/admin/product/AdminProductList')
const AdminProductDetails = () => System.import('@/pages/admin/product/AdminProductDetails')
const AdminProductUpsert = () => System.import('@/pages/admin/product/AdminProductUpsert')
const AdminProductSizes = () => System.import('@/pages/admin/product/AdminProductSizes')
const AdminReports = () => System.import('@/pages/admin/AdminReports')
const AuthZeroCallback = () => System.import('@/pages/admin/AuthZeroCallback')


function requireAuth(to, from, next) {
    if(window.localStorage.vuex) {
        let json = JSON.parse(window.localStorage.vuex);

        // this seems more reliable than 'store.getters.isAuthenticated'
        // NOTE:  there seems to be a race condition when attempting to use the
        // 'isAuthenticated' getter from the auth store ('store.getters.isAuthenticated').  
        // Using the localStorage value seems to always work.
        let isLoggedIn = new Date().getTime() < json.auth.expires_at;
        if (isLoggedIn) {
            next();
            return;
        }
    }

    next({
        path: '/'
    });
}


export function createRouter () {
    const router = new Router({
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
                name: 'login',
                path: '/acts/login',
                component: Login
            },
            {
                name: 'adminHome',
                path: '/acts',
                component: AdminHome,
                beforeEnter: requireAuth
            },
            {
                name: 'adminProductList',
                path: '/acts/products',
                component: AdminProductList,
                beforeEnter: requireAuth
            },
            {
                name: 'adminProductDetails',
                path: '/acts/product/details/:id',
                component: AdminProductDetails,
                beforeEnter: requireAuth
            },
            {
                name: 'adminProductAdd',
                path: '/acts/product/add',
                component: AdminProductUpsert,
                beforeEnter: requireAuth
            },
            {
                name: 'adminProductUpsert',
                path: '/acts/product/edit/:id',
                component: AdminProductUpsert,
                beforeEnter: requireAuth
            },
            {
                name: 'adminProductSizes',
                path: '/acts/product/sizes',
                component: AdminProductSizes,
                beforeEnter: requireAuth
            },
            {
                name: 'adminReports',
                path: '/acts/reports',
                component: AdminReports,
                beforeEnter: requireAuth
            },
            {
                name: 'Callback',
                path: '/callback',
                component: AuthZeroCallback
            },
            {
                path: '*',
                redirect: '/'
            }
        ]
    });

    return router;
}