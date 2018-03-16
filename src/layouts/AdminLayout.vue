<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { Container, Header, Aside, Main, Menu, MenuItem, Submenu, Button } from 'element-ui'

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Button);

export default {
    methods: {
        handleResize: function() {
            this.$store.dispatch('ui/handleResize');
        },

        toggleSidebar: function() {
            this.$store.dispatch('ui/toggleSidebar')
        },

        goHome: function() {
            this.$router.push({ name: 'adminProductList' });
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
        <el-container>
            <el-aside width="200px" class="sidebar" :class="{'sidebar-open': sidebarOpened}">
                <el-menu
                    :router="true"
                    background-color="#304156"
                    text-color="#fff"
                    active-text-color="#ffd04b">

                    <el-submenu index="1">
                        <template slot="title">
                            <i class="fa fa-cubes"></i>
                            <span>{{ $t('Products') }}</span>
                        </template>

                        <el-menu-item :route="{ name: 'adminProductList' }" index="/products">List</el-menu-item>
                    </el-submenu>

                    <el-menu-item :route="{ name: 'adminReports' }" index="/reports">
                        <i class="fa fa-bar-chart"></i>
                        <span>{{ $t('Reports') }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header>
                    <div role="banner" class="Header">
                        <div class="Header-container">
                            <i class="fa fa-bars colorGrayLighter fs20 cursorPointer" 
                            aria-hidden="true"
                            @click="toggleSidebar"></i>

                            <div class="Header-brand">
                                <img class="Header-image cursorPointer" @click="goHome" src="/static/images/logo_header.png" alt="gmnst" />
                            </div>

                            <nav class="Navigation">
                                <ul class="Navigation-list">
                                    <li>
                                        <el-button type="text"
                                            @click="logout"
                                            class="colorBlack">{{ $t('LOGOUT') }}</el-button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </el-header>

                <el-main>
                    <slot></slot>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<style lang="scss">
    @import "../assets/css/components/_variables.scss";
    @import "../assets/css/components/_mixins.scss";

    .layoutContainer {
        .sidebar {
            position: absolute;
            opacity: 0;

            &.sidebar-open {
                position: static;
                opacity: 1;
                transition: opacity .5s linear;
            }
        }

        .el-aside {
            background-color: #304156;
            color: #fff;
        }

        .el-header {
            background-color: #fff;
            color: #333;
            line-height: 60px;
        }

        .el-menu {
            border: 0;

            .fa {
                vertical-align: middle;
                margin-right: 10px;
            }
        }

        .fa-bars {
            line-height: 60px;
        }

        .displayNone {
            display: none;
        }
    }

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
