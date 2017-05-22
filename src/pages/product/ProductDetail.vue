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

                        <div class="title is-3 has-text-muted">
                            <product-price :product="product"></product-price>
                        </div>

                        <hr>

                        <div class="ptm">
                            <!-- Size -->
                            <div class="displayTableRow">
                                <div class="displayTableCell prm pbm fwb">{{ $t('Size') }}:</div>
                                <div class="displayTableCell pbm">
                                    <span class="select">
                                        <select name="selectedSize" v-model="selectedSize">
                                            <option value=""></option>
                                            <option v-for="size in sizeOptions" :value="size">{{ $t(size) }}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div class="displayTableRow">
                                <div class="displayTableCell prm pbl fwb">{{ $t('Quantity') }}:</div>
                                <div class="displayTableCell pbl">
                                    <span class="select">
                                        <select name="selectedQty" v-model="selectedQty">
                                            <option value=""></option>
                                            <option v-for="qty in quantityOptions" :value="qty">{{ qty }}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>

                            <div class="displayTableRow">
                                <div class="displayTableCell prm pbl"></div>
                                <div class="displayTableCell pbl title is-3 has-text-muted">
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
import isObject from 'lodash.isobject'
import Vue from 'vue'
import Notification from 'vue-bulma-notification'
import api from '../../util/api';
import ProductPrice from '../../components/product/ProductPrice.vue'


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
                openNotification({
                    title: 'Cart updated',
                    type: 'success'
                })
            }

            console.log('add to cart');
        },

        fetchProduct(id) {
            api.getProductBySeoUri(id).then((product) => {
                console.log('PRODUCT', product);
                this.product = product;

                this.buildSizeOptions(product);

                // Change Page title
                document.title = this.product.title;
            });
        },

        buildSizeOptions(product) {
            let sizeOpts = [];

            // if (isObject(product) && !product.hasOwnProperty('__selectedOptions')) {
            //    product.__selectedOptions = {};
            // }

            if (Array.isArray(product.sizes)) {
                product.sizes.forEach((obj) => {
                    if (obj.is_visible && obj.stock_qty) {
                        sizeOpts.push(obj.size);
                    }
                });

                this.sizeOptions = sizeOpts;
            }
        },

        buildQtyOptions() {
            let opts = [];

            for (var i = 1; i <= 100; i++) {
                opts.push(i);
            }

            this.quantityOptions = opts;
        }
    },

    watch: {
        id: function(val) {
            this.fetchMovie(val);
        }
    },

    created() {
        this.fetchProduct(this.$route.params.id);
        this.buildQtyOptions();
    }
}
</script>

<style>
.picShadow {
    box-shadow: 0 0 3px #333;
}
.has-text-muted {
  color: #95A5A6;
}

</style>

