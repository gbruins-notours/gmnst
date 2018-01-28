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
            product: null,
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
            //TODO
            this.$router.push({ 
                name: 'adminProductEdit',
                params: { id } 
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

                productService.buildPictures(product).then((pics) => {
                    this.productPics = pics;
                });
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
            {{ product }}
        </div>
    </admin-layout>
</template>


<style lang="scss" scoped   >
    .prodPic {
        width: 400px;
    }
</style>