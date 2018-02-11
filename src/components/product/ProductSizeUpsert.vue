<script>
import Vue from 'vue'
import { Notification, Button, Input, InputNumber, Checkbox, Select, Option } from 'element-ui'
import forEach from 'lodash.foreach'
import FormRow from '@/components/FormRow'
import ProductService from '@/pages/product/ProductService.js'
import ProductSizeService from '@/pages/product/ProductSizeService.js'

let productService = new ProductService();
let productSizeService = new ProductSizeService();

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
            type: String
        }
    },

    components: {
        FormRow
    },

    data: function() {
        return {
            size: {},
            product: {},
            sizeOptions: {}
        }
    },

    methods: {
        init() {
            productService
                .getProductById(this.productId, { viewAllRelated: true })
                .then((product) => {
                    if(!product) {
                        throw new Error(this.$t('Product not found'));
                    }

                    this.product = product;

                    if(!this.sizeId) {
                        this.size = {};
                    }
                    else {
                        forEach(product.sizes, (size) => {
                            if(size.id === this.sizeId) {
                                console.log("MATCH", this.sizeId);
                                this.size = size;
                            }
                        });
                    }

                    this.setSizeOptions(product);
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

        save() {
            if(this.size.id) {
                // updating existing product size
                productSizeService
                    .update(this.size)
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
            else {
                // adding new size to the product
                this.size.product_id = this.product.id;

                productSizeService
                    .create(this.size)
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

        setSizeOptions(product) {
            productSizeService
                .buildMissingSizeOptions(product)
                .then((options) => {
                    this.sizeOptions = options;
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

    created: function() {
        this.init();
    },

    watch: {
        'sizeId' (to, from) {
            console.log("SIZE ID CHANGED", this.sizeId)
            this.init();
        }
    }
}
</script>


<template>
    <div>
        <form-row label="Product:">{{ product.title }}</form-row>

        <form-row label="Size:">
            <span v-if="size.size">{{ $t(size.size) }}</span>
            <span v-else>
                <el-select v-model="size.size" placeholder="Choose">
                    <el-option
                        v-for="key in sizeOptions"
                        :key="key"
                        :label="$tc(key, 2)"
                        :value="key">
                    </el-option>
                </el-select>
            </span>
        </form-row>

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