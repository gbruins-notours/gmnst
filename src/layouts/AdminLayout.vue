<script>
import Vue from 'vue'
import { Menu, MenuItem } from 'element-ui'
import HeaderSidebarLayout from '@/layouts/HeaderSidebarLayout'

Vue.use(Menu);
Vue.use(MenuItem);

export default {
    components: {
        HeaderSidebarLayout
    },

    methods: {
        goHome: function() {
            this.$router.push({ name: 'adminProducts' });
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

                <el-menu-item :route="{ name: 'adminProducts' }" index="1">
                    <i class="fa fa-cubes"></i>
                    <span>Products</span>
                </el-menu-item>

                <el-menu-item :route="{ name: 'adminReports' }" index="2">
                    <i class="fa fa-bar-chart"></i>
                    <span>Reports2</span>
                </el-menu-item>
            </el-menu>
        </template>

        <template slot="header">
            <img class="Header-image cursorPointer" @click="goHome" src="/static/images/logo_header.png" alt="gmnst" />
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

        .Header-image {
            width: 135px;
            vertical-align: middle;
        }
    }
</style>
