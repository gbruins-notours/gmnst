<script>
import Vue from 'vue'
import { Notification, Button } from 'element-ui'
import AdminLayout from '@/layouts/AdminLayout'
import ProductService from '@/pages/product/ProductService.js'
import ProductDetailsJsonView from '@/components/product/admin/ProductDetailsJsonView'


let productService = new ProductService();
let currentNotification = null;

Vue.prototype.$notify = Notification;
Vue.use(Button);


function showNotification(Notification) {
    if(currentNotification) {
        currentNotification.close();
    }
    currentNotification = Notification
}


export default{
    components: {
        AdminLayout,
        ProductDetailsJsonView
    },

    data() {
        return {
            product: {}
        }
    },

    methods: {
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
    }
}
</script>


<template>
    <admin-layout>
        <div class="tar mbl">
            <el-button type="primary"
                        @click="goToEdit">EDIT PRODUCT</el-button>
        </div>

        <product-details-json-view :product="product"></product-details-json-view>
    </admin-layout>
</template>