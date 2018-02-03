<script>
import Vue from 'vue'
import { Menu, MenuItem, Submenu, Button } from 'element-ui'
import HeaderSidebarLayout from '@/layouts/HeaderSidebarLayout'

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Button);

export default {
    components: {
        HeaderSidebarLayout
    },

    methods: {
        goHome: function() {
            this.$router.push({ name: 'adminProductList' });
        },

        logout: function() {
            this.$store.dispatch('auth/LOGOUT');
            this.$router.push({ name: 'home' });
        }
    }
}
</script>


<template>
    <header-sidebar-layout>
        <template slot="sidebar">
            <el-menu
                :router="true"
                default-active="1"
                class="el-menu-vertical-demo"
                background-color="#304156"
                text-color="#fff"
                active-text-color="#ffd04b">

                <el-submenu index="1">
                    <template slot="title">
                        <i class="fa fa-cubes"></i>
                        <span>{{ $t('Products') }}</span>
                    </template>

                    <el-menu-item :route="{ name: 'adminProductList' }" index="1-1">List</el-menu-item>
                    <el-menu-item :route="{ name: 'adminProductSizes' }" index="1-2">Sizes</el-menu-item>
                </el-submenu>

                <el-menu-item :route="{ name: 'adminReports' }" index="2">
                    <i class="fa fa-bar-chart"></i>
                    <span>{{ $t('Reports') }}</span>
                </el-menu-item>
            </el-menu>
        </template>

        <template slot="header">
            <div role="banner" class="Header">
                <div class="Header-container">
                    <div class="Header-brand">
                        <img class="Header-image cursorPointer" @click="goHome" src="/static/images/logo_header.png" alt="gmnst" />
                    </div>

                    <nav class="Navigation">
                        <ul class="Navigation-list">
                            <li>
                                <el-button type="warning"
                                    @click="logout"
                                    class="colorBlack">{{ $t('LOGOUT') }}</el-button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </template>

        <template slot="main">
            <slot></slot>
        </template>
    </header-sidebar-layout>
</template>


<style lang="scss">
    .layoutContainer {
        .el-menu {
            border: 0;

            .fa {
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }



    @import "../assets/css/components/_variables.scss";
    @import "../assets/css/components/_mixins.scss";

    .Header {
        background-color: #fff;
        position: relative;
    }

    .Header-container {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .Header-brand {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        flex-grow: 1;
        align-items: center;
        color: #02182B;
        margin-left: 20px;
    }

    .Header-image {
        display: inline-block;
        width: 135px;
        vertical-align: middle;
    }

    .Header-image {
        @include grow()
    }
    .Header-image:hover {
        @include growHover()
    }

    .Navigation {
        background-color: whitesmoke;
        color: #010101;
        width: 100%;
    }

    .Navigation-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        -ms-flex-item-align: center;
        align-self: center;
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


    @media #{$medium-and-up}  {
        .Header-container {
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
        }
        .Header-brand {
            max-width: 170px;
        }

        .Navigation {
            background-color: white;
            padding: 0;
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
        .Navigation-list {
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
        }
    }
</style>
