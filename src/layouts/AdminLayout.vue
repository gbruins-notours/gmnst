<script>
import Vue from 'vue'
import {  mapState } from 'vuex'
import { Button } from 'element-ui'
import SideNav from '@/components/AppSidenav'

Vue.use(Button);

export default {
    components: {
        SideNav
    },

    methods: {
        handleResize: function() {
            this.$store.dispatch('ui/windowResize');
        },

        logout: function() {
            this.$store.dispatch('auth/LOGOUT');
            this.$router.push({ name: 'home' });
        }
    },

    computed: {
        ...mapState({
            sidebarOpened: state => {
                return state.ui.sidebarOpened
            }
        })
    },

    created: function () {
        window.addEventListener('resize', this.handleResize)
    }
}
</script>


<template>
    <div class="layoutContainer">
        <side-nav></side-nav>

        <header role="banner" class="header" :class="{'sidenav-opened': $store.state.ui.sidebarOpened}">
            <div class="header-container">
                <i class="fa fa-bars colorGrayLighter fs20 cursorPointer" 
                    aria-hidden="true"
                    @click="$store.dispatch('ui/toggleSidebar')"></i>

                <nav class="navigation">
                    <ul class="navigation-list">
                        <li>
                            <el-button type="text"
                                @click="logout"
                                class="colorBlack">{{ $t('LOGOUT') }}</el-button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

        <main :class="{'sidenav-opened': $store.state.ui.sidebarOpened}">
            <slot></slot>
        </main>
    </div>
</template>


<style lang="scss">
@import "../assets/css/components/_variables.scss";
@import "../assets/css/components/_mixins.scss";

.layoutContainer {

    header, main {
        transition: .5s;
    }

    @media #{$medium-and-up} {
        .sidenav-opened {
            padding-left: 200px;
            transition: .5s;
        }
    }

    .fa-bars {
        line-height: 60px;
    }

    .header {
        background-color: #fff;
        position: relative;
        color: #333;
        line-height: 60px;
    }

    .header-container {
        @include flexbox();
        @include flex-wrap(nowrap);
        flex-direction: row;
        padding: 0 20px;
    }

    .header-image {
        display: inline-block;
        width: 135px;
        vertical-align: middle;
    }

    .header-image {
        @include grow()
    }
    .header-image:hover {
        @include growHover()
    }

    .navigation {
        background-color: white;
        padding: 0;
        color: #010101;
        -webkit-box-ordinal-group: 3;
        -ms-flex-order: 2;
        order: 2;
        width: auto;
        -webkit-box-flex: 2;
        -ms-flex-positive: 2;
        flex-grow: 2;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-item-align: center;
        align-self: center;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }

    .navigation-list {
        @include flexbox();
        @include justify-content(space-around);
        @include align-self(center);
        margin: 0 20px 0 0;
        margin: 0;

        li {
            list-style: none;
            padding: 0;
            text-transform: uppercase;
            color: #7a7a7a;
            font-size: 14px;
            text-decoration: none;
            cursor: pointer;
            padding: 0 10px;
            height: 60px; 
            line-height: 60px; 

            &:hover,
            &:focus {
                color: #363636;
            }

            &.active {
                border-bottom: 3px solid #41b883;
                color: #000;
            }
        }
    }
}
</style>
