<template>
    <div>
        <!--<div class="section product-header">-->
            <!--<div class="container">-->
                <!--<div class="columns">-->
                    <!--<div class="column">-->
                        <!--<span class="title is-12">{{ product.title }}</span>-->
                        <!--<span class="title is-3 has-text-muted">&nbsp;-&nbsp;</span>-->
                        <!--<span class="title is-4 has-text-muted">{{ productCategory }}</span>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <div class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-6">
                        <div class="image is-2by2 picShadow">
                            <img v-bind:src="productPic">
                        </div>
                    </div>
                    <div class="column is-5 is-offset-1">
                        <div class="title is-2">{{ product.title }}</div>

                        <div class="pbl">{{ product.description_long }}</div>

                        <div class="title is-3">
                            <product-price :product="product"></product-price>
                        </div>

                        <hr>

                        <div class="prod-attributes-table">
                            <!-- Size -->
                            <div class="row">
                                <div class="label">{{ $t('Size') }}:</div>
                                <div class="value">
                                    <span class="select">
                                        <select name="selectedSize" v-model="selectedSize">
                                            <option value=""></option>
                                            <option v-for="size in sizeOptions" :value="size">{{ $t(size) }}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div class="row">
                                <div class="label">{{ $t('Quantity') }}:</div>
                                <div class="value">
                                    <span class="select">
                                        <select name="selectedQty" v-model="selectedQty">
                                            <option value=""></option>
                                            <option v-for="qty in quantityOptions" :value="qty">{{ qty }}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>

                            <div class="row">
                                <div class="label"></div>
                                <div class="value title is-3 has-text-muted">
                                    <a class="button is-primary" @click="addToCart()">{{ $t('Add to cart') }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Promise from 'bluebird';
import isObject from 'lodash.isobject'
import Vue from 'vue'
import Notification from 'vue-bulma-notification'
import api from '../../util/api'
import ProductPrice from '../../components/product/ProductPrice.vue'
import { mapActions } from 'vuex'


const NotificationComponent = Vue.extend(Notification)

const openNotification = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 4500,
    container: '.notifications'
}) => {
    return new NotificationComponent({
        el: document.createElement('div'),
        propsData
    })
}

export default {
    props: ['id'],

    data() {
        return {
            product: {},
            sizeOptions: [],
            quantityOptions: [],
            selectedSize: null,
            selectedQty: null
        }
    },

    components: {
        ProductPrice
    },

    computed: {
        productCategory: function() {
            if (isObject(this.product.type) && this.product.type.hasOwnProperty('label')) {
                return this.product.type.label;
            }
            return;
        },
        productPic: function() {
            if (this.product.featured_pic) {
                return '/static/images/product/' + this.product.featured_pic;
            }
            return;
        }
    },

    methods: {
        ...mapActions([
            'ADD_ITEM_TO_CART'
        ]),

        addToCart() {
            if (isObject(this.product) && !this.product.hasOwnProperty('__selectedOptions')) {
                this.product.__selectedOptions = {};
            }

            if (!this.selectedSize) {
                openNotification({
                    title: this.$t('Please select a size'),
                    // message: 'thats right',
                    type: 'danger'
                })
            }
            else if (!this.selectedQty) {
                openNotification({
                    title: this.$t('Please select a quantity'),
                    type: 'danger'
                })
            }
            else {
                console.log('add to cart');
                this.ADD_ITEM_TO_CART({
                    id: this.product.id,
                    options: {
                        size: this.selectedSize,
                        qty: this.selectedQty
                    }
                });

                openNotification({
                    title: 'Cart updated',
                    type: 'success'
                })
            }
        },

        buildSizeOptions(product) {
            return new Promise((resolve, reject) => {
                let sizeOpts = [];
                let maxInventoryCount = 0;

                if (Array.isArray(product.sizes)) {
                    product.sizes.forEach((obj) => {
                        if (obj.is_visible && obj.inventory_count) {
                            sizeOpts.push(obj.size);

                            if (obj.inventory_count > maxInventoryCount) {
                                maxInventoryCount = obj.inventory_count;
                            }
                        }
                    });
                }

                resolve({
                    sizeOpts,
                    maxInventoryCount
                });
            });
        },

        buildQtyOptions(maxInventoryCount) {
            let opts = [];
            let max = (maxInventoryCount < 100) ? maxInventoryCount : 100;

            for (var i = 1; i <= max; i++) {
                opts.push(i);
            }

            return opts.length ? opts : null;
        }
    },

    created() {
        api.getProductBySeoUri(this.$route.params.id)
            .then((product) => {
                this.product = product;
                console.log('PRODUCT', this.product);

                document.title = product.title;
                return this.buildSizeOptions(product);
            })
            .then((result) => {
                this.sizeOptions = result.sizeOpts;
                this.quantityOptions = this.buildQtyOptions(result.maxInventoryCount);
            });
    }
}
</script>

<style lang="scss">
.picShadow {
    box-shadow: 0 0 3px #333;
}

.prod-attributes-table {
    padding-top: 10px;

    .row {
        display: table-row;
    }

    .label {
        display: table-cell;
        padding: 0 10px 10px;
        font-weight: bold;
    }

    .value {
        display: table-cell;
        padding-bottom: 10px;
    }
}

</style>

