<template>
    <el-card :body-style="{ padding: '0px' }" class="heightAll">
        <img :src="productPic" alt="Image" class="image">
        <div class="cardContent">
            <div class="fwb mbs">{{ product.title }}</div>
            <div>{{ product.description_short }}</div>
        </div>
    </el-card>
</template>

<script>
    import Vue from 'vue'
    import { Card } from 'element-ui';

    Vue.use(Card)

    export default {
        props: ['product'],

        computed: {
            productPic: function() {
                if (this.product.featured_pic) {
                    return '/static/images/product/' + this.product.featured_pic;
                }
                return;
            }
        }
    }
</script>

<style>
    .cardContent {
        padding: 14px;
    }
</style>
