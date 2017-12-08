<script>
import Vue from 'vue'
import Promise from 'bluebird';
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex';
import isObject from 'lodash.isobject'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import ShoppingCartService from './pages/cart/shopping_cart_service.js'
import UtilityService from './utility_service.js'

let shoppingCartService = new ShoppingCartService();
let utilityService = new UtilityService();

export default {
    components: {
        AppHeader,
        AppFooter
    },

    computed: {
        ...mapGetters([
            'app'
        ])
    },

    methods: {
        ...mapActions([
            'TOGGLE_DEVICE'
        ])
    },

    created () {
        const { body } = document
        const WIDTH = 768
        const RATIO = 3

        const handler = () => {
            if (!document.hidden) {
                let rect = body.getBoundingClientRect()
                let isMobile = rect.width - RATIO < WIDTH
                this.TOGGLE_DEVICE(isMobile ? 'mobile' : 'other')
            }
        }

        document.addEventListener('visibilitychange', handler)
        window.addEventListener('DOMContentLoaded', handler)
        window.addEventListener('resize', handler)

        if (!this.app.jwtKey) {
            utilityService.getJwtToken().then((jsonWebToken) => {
                this.$store.dispatch('JWT_KEY', jsonWebToken);

                shoppingCartService
                    .getCart()
                    .then((cart) => {
                        this.$store.dispatch('CART_SET', cart);
                    })
                    .catch((error) => {
                        console.log('GET JWT Error', error);
                    });
            })
        }
    }
}
</script>


<template>
    <div id="app">
        <app-header></app-header>
        <main>
            <router-view></router-view>
        </main>
        <app-footer></app-footer>
    </div>
</template>


<style lang="scss">
    @import "assets/css/base";

    #app {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }

    main {
        flex: 1;
    }
</style>