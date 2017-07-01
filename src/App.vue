<template>
    <div id="app">
        <navbar></navbar>
        <default-layout></default-layout>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import Promise from 'bluebird';
import Navbar from '@/components/Navbar'
import DefaultLayout from '@/layouts/default'
import FooterBar from '@/components/FooterBar'
import { mapActions } from 'vuex';
import isObject from 'lodash.isobject';

export default {
    components: {
        Navbar,
        DefaultLayout,
        FooterBar
    },

    // data: function() {
    //     return {
    //         inCheckoutFlow: false
    //     }
    // }

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

        if (!this.$store.state.jwtKey || !isObject(this.$store.state.appInfo)) {
            this.JWT_KEY()
                .then(() => {
                    this.CART_SYNC();
                    this.APP_INFO();
                })
                .catch((error) => {
                        console.log('GET JWT Error', error);
                });
        }
    },

    methods: {
        ...mapActions([
            'APP_INFO',
            'JWT_KEY',
            'CART_SYNC',
            'TOGGLE_DEVICE'
        ])
    }

    // watch: {
    //     '$route' (to, from) {
    //         console.log("Navbar ROUTE watch", to)
    //         // if(isObject(to) && to.name && to.name.indexOf('cart') === 0) {
    //         //     console.log("IS CHECKOUT FLEO!")
    //         //     this.inCheckoutFlow = true;
    //         // }
    //     }
    // }
}
</script>

<style lang="scss">
    @import "assets/css/base";
</style>
