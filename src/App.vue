<template>
    <div id="app">
        <navbar :ready="ready"></navbar>
        <main>
            <router-view></router-view>
        </main>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import Promise from 'bluebird';
import { mapGetters } from 'vuex'
import Navbar from '@/components/Navbar'
import FooterBar from '@/components/FooterBar'
import { mapActions } from 'vuex';
import isObject from 'lodash.isobject';

export default {
    components: {
        Navbar,
        FooterBar
    },

    computed: {
        ...mapGetters([
            'app'
        ])
    },

    methods: {
        ...mapActions([
            'GET_BRAINTREE_CLIENT_TOKEN',
            'GET_PRODUCT_INFO',
            'JWT_KEY',
            'CART_PULL',
            'TOGGLE_DEVICE'
        ])
    },

    data: function() {
        return {
            ready: false
        }
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
            this.JWT_KEY()
                .then(() => {
                    Promise.all([
                        this.CART_PULL(),
                        this.GET_PRODUCT_INFO(),
                        this.GET_BRAINTREE_CLIENT_TOKEN()    
                    ]).then(() => {
                        this.ready = true;
                    })
                })
                .catch((error) => {
                    console.log('GET JWT Error', error);
                });
        }
        else {
            this.ready = true;
        }
    }
}
</script>

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
