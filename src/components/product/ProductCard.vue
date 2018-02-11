<script>
    import Vue from 'vue'
    import { Card } from 'element-ui'
    import ProductService from '@/pages/product/ProductService.js'

    let productService  = new ProductService();

    Vue.use(Card)

    export default {
        props: ['product'],

        computed: {
            productPic: function() {
                return productService.featuredProductPic(this.product);
            }
        }
    }
</script>


<template>
    <el-card :body-style="{ padding: '0px' }" class="heightAll">
        <img :src="productPic" alt="Image" class="image">
        <div class="cardContent">
            <div class="fwb mbs">{{ product.title }}</div>
            <div>{{ product.description_short }}</div>
        </div>
    </el-card>
</template>


<style>
    .cardContent {
        padding: 14px;
    }
</style>