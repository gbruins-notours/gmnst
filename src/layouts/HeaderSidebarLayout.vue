<script>
import Vue from 'vue'
import { Container, Header, Aside, Main } from 'element-ui'

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);

export default {
}
</script>

<template>
    <div class="layoutContainer">
        <el-container>
            <el-aside width="200px">
                <slot name="sidebar"></slot>
            </el-aside>

            <el-container>
                <el-header>
                    <slot name="header"></slot>
                </el-header>

                <el-main>
                    <slot name="main"></slot>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<style lang="scss">
    .layoutContainer {
        .el-aside {
            background-color: #304156;
            color: #fff;
        }

        .el-header {
            background-color: #fff;
            color: #333;
            line-height: 60px;
        }
    }
</style>
