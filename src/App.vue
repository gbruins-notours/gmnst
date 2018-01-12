<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import isObject from 'lodash.isobject'
// import DefaultLayout from '@/layouts/default'
import ShoppingCartService from './pages/cart/shopping_cart_service.js'
import UtilityService from './utility_service.js'

let shoppingCartService = new ShoppingCartService();
let utilityService = new UtilityService();

export default {
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Welcome',
        // all titles will be injected into this template
        titleTemplate: (titleChunk) => {
            return titleChunk ? `${titleChunk} | gmnst` : 'gmnst';
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { vmid: 'description', name: 'description', content: 'T-shirts and Hats for the gymnastics lifestyle' }
        ],
        link: [
            { rel: 'favicon', href: '/static/favicon.ico' }
        ]
    },

    // components: {
    //     DefaultLayout
    // },

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
        <router-view></router-view>
    </div>
</template>


<style lang="scss">
    @import "assets/css/base";

    #app {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }

    .layoutContainer {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }

    main {
        flex: 1;
    }
</style>