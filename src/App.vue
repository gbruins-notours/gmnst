<template>
    <div id="app">
        <navbar :show="true"></navbar>
        <default-layout></default-layout>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DefaultLayout from '@/layouts/default'
import FooterBar from '@/components/FooterBar'
import api from './util/api'
import { mapActions } from 'vuex';

export default {
    components: {
        Navbar,
        DefaultLayout,
        FooterBar
    },

    beforeMount () {
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

        api.getToken().then((response) => {
            this.JWT_KEY(response.headers['x-authorization'])

            api.getInfo().then((data) => {
                this.APP_INFO(data);
            });
        })
        .catch((error) => {
            console.log('GET JWT Error', error);
        });
    },

    methods: {
        ...mapActions([
            'APP_INFO',
            'JWT_KEY',
            'TOGGLE_DEVICE'
        ])
    }
}
</script>

<style lang="scss">
    @import "assets/css/base";
</style>
