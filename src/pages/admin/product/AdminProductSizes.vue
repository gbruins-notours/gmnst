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

        }
    },



    methods: {

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
TODO: product sizes
        </div>
    </admin-layout>
</template>