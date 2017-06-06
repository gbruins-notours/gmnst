<template>
    <div id="app">
        <navbar :show="false"></navbar>
        <default-layout></default-layout>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import Promise from 'bluebird';
import Navbar from '@/components/Navbar'
import DefaultLayout from '@/layouts/default'
import FooterBar from '@/components/FooterBar'
import api from './util/api'
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        Navbar,
        DefaultLayout,
        FooterBar
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

        this.getJwtToken().then(this.getAppInfo);
    },

    methods: {
        ...mapActions([
            'APP_INFO',
            'JWT_KEY',
            'TOGGLE_DEVICE'
        ]),

        ...mapGetters([
            'jwtKey',
            'appInfo'
        ]),

        getJwtToken() {
            return new Promise((resolve, reject) => {
                if (!this.jwtKey()) {
                    api.getToken().then((response) => {
                        console.log("GOT TOKEN", response.headers['x-authorization']);

                        this.JWT_KEY(response.headers['x-authorization']);
                        resolve();
                    })
                    .catch((error) => {
                        console.log('GET JWT Error', error);
                        resolve();
                    });
                }
                else {
                    console.log("JWT KEY ALREADY EXISTS")
                    resolve();
                }
            });
        },

        getAppInfo() {
            return new Promise((resolve, reject) => {
                api.getInfo().then((response) => {
                    this.APP_INFO(response);
                    return resolve();
                })
                .catch((error) => {
                    console.log('GET INFO Error', error);
                    return resolve();
                });
            });
        }
    }
}
</script>

<style lang="scss">
    @import "assets/css/base";
</style>
