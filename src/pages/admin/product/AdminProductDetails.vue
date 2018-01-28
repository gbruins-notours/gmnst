<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Notification, Button } from 'element-ui'
import TreeView from 'vue-json-tree-view'
import AdminLayout from '@/layouts/AdminLayout'
import ProductService from '@/pages/product/product_service.js'


let productService = new ProductService();

Vue.prototype.$notify = Notification;
Vue.use(Button);
Vue.use(TreeView);

let currentNotification = null;


function showNotification(Notification) {
    if(currentNotification) {
        currentNotification.close();
    }
    currentNotification = Notification
}


export default{
    components: {
        AdminLayout
    },

    data() {
        return {
            product: {},
            productPics: [],
            productPicPath: productService.getProductPicPath()
        }
    },

    computed: {
        ...mapGetters({
            productSubTypes: 'product/subTypes'
        })
    },

    methods: {
        getProductPic(prod) {
            return productService.featuredProductPic(prod);
        },

        goToEdit() {
            this.$router.push({ 
                name: 'adminProductEdit',
                params: { id: this.product.id } 
            });
        }
    },

    created() {
        productService
            .getProductById(this.$route.params.id)
            .then((product) => {
                if(!product) {
                    throw new Error(this.$t('Product not found'));
                }

                this.product = product;
            })
            .catch((e) => {
                showNotification(
                    this.$notify({
                        type: 'error',
                        title: e.message,
                        duration: 0
                    })
                )
            });
    },
}
</script>


<template>
    <admin-layout>
        <div v-cloak>
            <div class="tar mbl">
                <el-button type="primary"
                           @click="goToEdit">EDIT PRODUCT</el-button>
            </div>

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
                        <img :src="productPicPath + pic.file_name" class="prodPic">
                        <div>{{ pic.file_name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </admin-layout>
</template>


<style lang="scss" scoped   >
    .prodPic {
        width: 400px;
    }
</style>