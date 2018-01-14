<script>
import Vue from 'vue'
import { Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);


export default {
    methods: {
        goHome: function() {
            this.$router.push({ name: 'adminProducts' });
        }
    }
}
</script>

<template>
    <div class="layoutContainer">
        <el-container>
            <el-aside width="200px">
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
            </el-aside>

            <el-container>
                <el-header>
                    <img class="Header-image cursorPointer" @click="goHome" src="/static/images/logo_header.png" alt="gmnst" />
                </el-header>

                <el-main>
                    <slot></slot>
                </el-main>
            </el-container>
        </el-container>
    </div>
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

        .el-aside {
            background-color: #304156;
            color: #fff;
        }

        .el-header {
            background-color: #fff;
            color: #333;
            line-height: 60px;
        }

        .Header-image {
            width: 135px;
            vertical-align: middle;
        }

    }
</style>
