<template>
    <div class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-6">
                    <div class="image is-2by2 phm">
                       <carousel :autoplay="true"
                                 :autoplayHoverPause="true"
                                 :navigationEnabled="true"
                                 :perPage="1"
                                 paginationColor="#cacac8"
                                 paginationActiveColor="#ed198a">
                          <slide v-for="(pic, key) in productPics" :key="key">
                            <img :src="pic">
                          </slide>
                        </carousel>

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
                                <el-button type="warning" @click="addToCart" class="colorBlack">{{ $t('Add to cart') }}</el-button>
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
import { Select, Option, InputNumber, Notification, Button } from 'element-ui'
import api from '../../util/api'
import ProductPrice from '../../components/product/ProductPrice.vue'
import { mapActions } from 'vuex'
import _forEach from 'lodash.forEach';
import { Carousel, Slide } from 'vue-carousel';

Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Button);

export default {
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
        ProductPrice,
        Carousel,
        Slide
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

                resolve( getSortedArray(sortObj) );
            });
        }
    },

    created() {
        // api.getProductBySeoUri(this.$route.params.id)
        api.getProductBySeoUri(this.$route.params.itemId)
            .then((product) => {
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
@import '../../assets/css/components/_variables.scss';

.VueCarousel-navigation-button {
    font-size: 20px;
    color: $colorPink !important;
}
.VueCarousel-navigation--disabled {
    color: $colorGray !important;
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
