<template>
    <el-card :body-style="{ padding: '0px' }">
        <img :src="productPic" alt="Image" class="image cursorPointer" @click="goToDetails">
        <div style="padding: 14px;" @click="goToDetails" class="cursorPointer">
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
        },

        methods: {
            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push(`/item/${this.product.seo_uri}`);
                }
            }
        }
    }
</script>
