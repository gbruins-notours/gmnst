<script>
import Vue from 'vue'
import TreeView from 'vue-json-tree-view'
import ProductService from '@/pages/product/ProductService.js'

let productService = new ProductService();

Vue.use(TreeView);

export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    }
}
</script>


<template>
    <div>
        <div class="g-spec">
            <div class="g-spec-label">JSON</div>
            <div class="g-spec-content">
                <tree-view :data="product" :options="{maxDepth: 3}"></tree-view>
            </div>
        </div>

        <div class="g-spec">
            <div class="g-spec-label">Pictures</div>
            <div class="g-spec-content">
                <div v-for="pic in product.pics" class="inlineBlock mrl vat">
                    <img :src="pic.url" class="prodPic">
                    <div>{{ pic.url }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .prodPic {
        width: 400px;
    }

    .tree-view-item-leaf {
        white-space: normal !important;
    }
</style>