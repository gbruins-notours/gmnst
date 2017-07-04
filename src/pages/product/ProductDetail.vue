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
                            <!-- <img :src="productPic"> -->
                            <el-carousel trigger="click" height="450px">
                                <el-carousel-item v-for="pic in productPics" :key="pic">
                                    <img :src="pic">
                                </el-carousel-item>
                           </el-carousel>
                        </div>
                    </div>
                    <div class="column is-5 is-offset-1">
                        <div class="title is-2">{{ product.title }}</div>

                        <div class="pbl">{{ product.description_long }}</div>

                        <div class="title is-3">
                            <product-price :product="product"></product-price>
                        </div>

                        <div class="pvl"><hr></div>

                        <div class="prod-attributes-table">
                            <!-- Size -->
                            <div class="row">
                                <div class="label">{{ $t('Size') }}:</div>
                                <div class="value">
                                    <span class="select">
                                        <el-select v-model="selectedSize" placeholder="Select">
                                            <el-option
                                                    v-for="size in sizeOptions"
                                                    :key="size"
                                                    :label="$t(size)"
                                                    :value="size">
                                            </el-option>
                                        </el-select>
                                    </span>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div class="row">
                                <div class="label">{{ $t('Quantity') }}:</div>
                                <div class="value">
                                    <el-input-number v-model="selectedQty"
                                                     :step="1"
                                                     :min="1"
                                                     :max="product.inventory_count"
                                                     :debounce="500"
                                                     :controls="false"
                                                     class="width50"></el-input-number>
                                </div>
                            </div>

                            <div class="row">
                                <div class="label"></div>
                                <div class="value is-3 ptl">
                                    <el-button type="warning" @click="addToCart" class="mbs colorBlack">{{ $t('Add to cart') }}</el-button>
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
import { Select, Option, InputNumber, Notification, Button, Carousel, CarouselItem } from 'element-ui'
import api from '../../util/api'
import ProductPrice from '../../components/product/ProductPrice.vue'
import { mapActions } from 'vuex'
import _forEach from 'lodash.forEach';

Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Carousel);
Vue.use(CarouselItem);

export default {
    props: ['id'],

    data() {
        return {
            product: {},
            sizeOptions: [],
            productPics: [],
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
            'CART_ITEM_ADD'
        ]),

        addToCart: function() {
//            if (isObject(this.product) && !this.product.hasOwnProperty('__selectedOptions')) {
//                this.product.__selectedOptions = {};
//            }

            if (!this.selectedSize) {
                Notification.error({
                    title: this.$t('Please select a size'),
                    message: this.$t('We want to make sure it fits!'),
                    duration: 4500
                });
            }
            else if (!this.selectedQty) {
                Notification.error({
                    title: this.$t('Please select a quantity'),
                    message: this.$t('Thanks!'),
                    duration: 4500
                });
            }
            else {
                this.CART_ITEM_ADD({
                    id: this.product.id,
                    options: {
                        size: this.selectedSize,
                        qty: this.selectedQty
                    }
                })
                .then(() => {
                    this.$router.push(`/cart/${this.product.id}`);
                });
            }
        },

        goToCart: function() {
            this.$router.push(`/cart/${this.product.id}`);
        },

        buildSizeOptions: function(product) {
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

        // buildPictures: function(product) {
        //     return new Promise((resolve, reject) => {
        //         let pics = [];
        //
        //         if(product.featured_pic) {
        //             pics.push('/static/images/product/' + product.featured_pic)
        //         }
        //
        //         if (Array.isArray(product.pics)) {
        //             product.pics.forEach((obj) => {
        //                 if (obj.is_visible && obj.file_name) {
        //                     pics.push('/static/images/product/' + obj.file_name);
        //                 }
        //             });
        //         }
        //
        //         resolve(pics);
        //     });
        // }
        buildPictures: function(product) {
            let sortObj = {};
            let pics = [];

            function add(sortOrder, val) {
                let order = sortOrder || 100;

                if(!sortObj.hasOwnProperty(order)) {
  	                 sortObj[order] = [];
                }

                 sortObj[order].push(val);
             }

             function getSortedArray(sortObj) {
                 let vals = [];

                 _forEach(sortObj, (arr) => {
                     if(Array.isArray(arr)) {
                        arr.forEach((val) => {
                            vals.push(val);
                        })
                     }
                 });

                 return vals;
            }

            return new Promise((resolve, reject) => {
                // featured pic is always first
                if(product.featured_pic) {
                    add(1, `/static/images/product/${product.featured_pic}`)
                }

                if (Array.isArray(product.pics)) {
                    product.pics.forEach((obj) => {
                        if (obj.is_visible && obj.file_name) {
                            add(obj.sort_order, `/static/images/product/${obj.file_name}`)
                        }
                    });
                }

                let sorted = getSortedArray(sortObj)
                console.log("SORTED PICS", sorted);

                resolve(sorted);
            });
        }
    },

    created() {
        api.getProductBySeoUri(this.$route.params.id)
            .then((product) => {
                console.log("PRODUCT", product);
                this.product = product;
                document.title = product.title;

                this.buildSizeOptions(product).then((result) => {
                    this.sizeOptions = result.sizeOpts;
                });

                this.buildPictures(product).then((pics) => {
                    this.productPics = pics;
                });
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
