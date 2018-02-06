<script>
import Vue from 'vue'
import { Notification, Button, Input, InputNumber, Checkbox, Select, Option } from 'element-ui'
import forEach from 'lodash.foreach'
import FormRow from '@/components/FormRow'
import ProductService from '@/pages/product/product_service.js'

let productService = new ProductService();

Vue.prototype.$notify = Notification;

Vue.use(Button);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);

let currentNotification = null;

function showNotification(Notification) {
    if(currentNotification) {
        currentNotification.close();
    }
    currentNotification = Notification
}

export default {
    props: {
        productId: {
            type: String,
            required: true
        },
        sizeId: {
            type: String,
            required: true
        }
    },

    components: {
        FormRow
    },

    data: function() {
        return {
            size: {},
            product: {},
        }
    },

    methods: {
        save() {
            productService
                .updateProductSize(this.size)
                .then((size) => {
                    this.$emit('updated', size)
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
    },

    created() {
        productService
            .getProductById(this.productId)
            .then((product) => {
                if(!product) {
                    throw new Error(this.$t('Product not found'));
                }

                this.product = product;

                forEach(product.sizes, (size) => {
                    if(size.id === this.sizeId) {
                        this.size = size;
                    }
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
    }
}
</script>


<template>
    <div>
        <form-row label="Product:">{{ product.title }}</form-row>

        <form-row label="Size:">{{ $t(size.size) }}</form-row>

        <form-row label="Sort order:">{{ size.sort }}</form-row>

        <form-row label="Is visible:">
            <el-checkbox v-model="size.is_visible"></el-checkbox>
        </form-row>

        <form-row label="Cost:">
            <el-input-number v-model="size.cost" controls-position="right" :step=".01"></el-input-number>
        </form-row>

        <form-row label="Base price:">
            <el-input-number v-model="size.base_price" controls-position="right" :step=".01"></el-input-number>
        </form-row>

        <form-row label="Sale price:">
            <el-input-number v-model="size.sale_price" controls-position="right" :step=".01"></el-input-number>
        </form-row>

        <form-row label="Is on sale:">
            <el-checkbox v-model="size.is_on_sale"></el-checkbox>
        </form-row>

        <form-row label="Inventory count:">
            <el-input-number v-model="size.inventory_count" controls-position="right" :step="1"></el-input-number>
        </form-row>

        <form-row label="">
            <div class="ptl">
                <el-button type="primary" @click="save()">SAVE</el-button>
            </div>
        </form-row>
    </div>
</template>