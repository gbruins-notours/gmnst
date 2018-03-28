<script>
import Vue from 'vue'
import { Menu, MenuItem, Submenu } from 'element-ui'

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);

export default {
    methods: {
        menuItemClick() {
            if(this.$store.state.ui.isMobile) {
                this.$store.dispatch('ui/closeSidebar');
            }
        }
    }
}
</script>


<template>
    <div class="sidenav-container">
        <aside class="sidenav" :class="{'sidenav-fixed': $store.state.ui.sidebarOpened}">
            <div class="sidenav-header">
                <img class="header-image cursorPointer" 
                    src="/static/images/logo_header.png"
                    @click="$router.push({ name: 'adminProductList' })" 
                    alt="gmnst" />
            </div>

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

                    <el-menu-item 
                        :route="{ name: 'adminProductList' }" 
                        index="/products"
                        @click="menuItemClick">List</el-menu-item>
                </el-submenu>

                <el-menu-item 
                    :route="{ name: 'adminReports' }" 
                    index="/reports"
                    @click="menuItemClick">
                    <i class="fa fa-bar-chart"></i>
                    <span>{{ $t('Reports') }}</span>
                </el-menu-item>
            </el-menu>
        </aside>

        <div class="sidenav-overlay"
            v-if="$store.state.ui.sidebarOpened"
            @click="$store.dispatch('ui/closeSidebar')"></div>
    </div>
</template>


<style lang="scss">
@import "../assets/css/components/_variables.scss";
@import "../assets/css/components/_mixins.scss";

.sidenav-container,
.sidenav {
    height: 100%;
    height: calc(100% + 60px);
    height: -moz-calc(100%); //Temporary Firefox Fix
}
.sidenav {
    position: fixed;
    width: 200px;
    left: 0;
    top: 0;
    margin: 0;
    padding-bottom: 60px;
    background-color: #304156;
    overflow-y: auto;
    transform: translateX(-105%);
    transition: .5s;
    z-index: 1;

    .sidenav-header {
        height: 60px; 
        line-height: 60px;
        text-align: center;
        background-color: rgba(0,0,0,.1);
    }
}

.sidenav.sidenav-fixed {
    transform: translateX(0);
    transition: .5s;
}

.sidenav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    opacity: 0;
    height: 120vh;
    background-color: rgba(0,0,0,.5);
    z-index: 997;
    display: none;
}

.el-menu {
    border: 0;

    .fa {
        vertical-align: middle;
        margin-right: 10px;
    }
}

// Fixed Sidenav hide on smaller
@media #{$medium-and-down} {
    .sidenav {
        &.sidenav-fixed {
            // transform: translateX(-105%);
            z-index: 999;
        }
    }

    .sidenav-overlay {
        opacity: 1;
        display: block;
    }
}
</style>