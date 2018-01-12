<script>
import Vue from 'vue'
import Promise from 'bluebird';
import isObject from 'lodash.isobject'
import _forEach from 'lodash.foreach'
import { Select, Option, InputNumber, Notification, Button, Loading } from 'element-ui'
import VueImg from 'v-img'
import { Carousel, Slide } from 'vue-carousel'
import SocialSharing from 'vue-social-sharing'
import DefaultLayout from '@/layouts/DefaultLayout'
import ProductPrice from '@/components/product/ProductPrice'
import NumberButtons from '@/components/NumberButtons'
import ProductService from '@/pages/product/product_service.js'
import ShoppingCartService from '@/pages/cart/shopping_cart_service.js'
import UtilityService from '@/utility_service.js'

let productService = new ProductService();
let shoppingCartService = new ShoppingCartService();
let utilityService = new UtilityService();
let pageUrl = utilityService.getSiteUrl(true);

Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Loading.directive)
Vue.use(SocialSharing)
Vue.use(VueImg, {
  altAsTitle: true,
  sourceButton: false, // Display 'download' button near 'close' that opens source image in new tab
  openOn: 'click', // Event listener to open gallery will be applied to <img> element
});

Vue.prototype.$notify = Notification;
let currentNotification = null;

export default {
    components: {
        DefaultLayout,
        ProductPrice,
        NumberButtons,
        Carousel,
        Slide
    },

    data() {
        return {
            product: {},
            sizeOptions: [],
            productPics: [],
            selectedSize: null,
            selectedQty: 1,
            isLoading: false,
            pageIsLoading: true,
            siteUrl: utilityService.getSiteUrl(true),
            pageUrl: `${utilityService.getSiteUrl(true)}${this.$route.fullPath}`,
            twitterUser: utilityService.getTwitterUser()
        }
    },

    computed: {
        productTitle() {
            return this.product.title;
        },
        productDesc() {
            return this.product.description_long;
        },
        mediaPicture() {
            return `${this.siteUrl}${this.productPics[0]}`
        }
    },

    methods: {
        addToCart: function() {
            if(currentNotification) {
                currentNotification.close();
            }

            if (!this.selectedSize) {
                currentNotification = this.$notify({
                    type: 'error',
                    title: this.$t('Please select a size'),
                    message: this.$t('We want to make sure it fits!'),
                    duration: 0
                });
            }
            else if (!this.selectedQty) {
                currentNotification = this.$notify({
                    type: 'error',
                    title: this.$t('Please select a quantity'),
                    message: this.$t('Thanks!'),
                    duration: 0
                });
            }
            else {
                this.isLoading = true;

                shoppingCartService.addItem({
                    id: this.product.id,
                    options: {
                        size: this.selectedSize,
                        qty: this.selectedQty
                    }
                })
                .then((cartData) => {
                    this.$store.dispatch('CART_SET', cartData);
                    this.isLoading = false;
                    this.$router.push(`/cart/${this.product.id}`);
                });
            }
        },

        goToCart: function() {
            this.$router.push(`/cart/${this.product.id}`);
        }
    },

    created() {
        productService
            .getProductBySeoUri(this.$route.params.itemId)
            .then((product) => {
                this.product = product;

                productService.buildSizeOptions(product).then((result) => {
                    this.sizeOptions = result.sizeOpts;
                });

                productService.buildPictures(product).then((pics) => {
                    this.productPics = pics;
                });
            })
            .finally(() => {
                this.pageIsLoading = false;
            });
    },

    metaInfo() {
        return {
            title: this.productTitle,
            meta: [
                { vmid: 'description', name: 'description', content: this.productDesc },
                { name: 'og:site_name', content: utilityService.getSiteName() },
                { name: 'og:url', content: this.$route.fullPath },
                { name: 'og:title', content: this.productTitle },
                { name: 'og:type', content: 'website' },
                { name: 'og:image', content: this.mediaPicture },
                { name: 'og:description', content: this.product.description_long },
            ]
        }
    }
}
</script>


<template>
    <default-layout>
        <div class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-6">
                        <div class="image is-2by2 phm">
                        <carousel :autoplay="true"
                                    :autoplayHoverPause="true"
                                    :navigationEnabled="true"
                                    :perPage="1"
                                    :loop="true"
                                    paginationColor="#cacac8"
                                    paginationActiveColor="#ed198a">
                            <slide v-for="(pic, key) in productPics" :key="key">
                                <img :src="pic" :alt="product.title" v-img:prod>
                            </slide>
                            </carousel>
                        </div>
                    </div>

                    <div class="column is-5 is-offset-1" v-loading="pageIsLoading">
                        <div class="fs30 mbm">{{ product.title }}</div>

                        <div class="pbl fs16">{{ product.description_long }}</div>

                        <div class="fs20">
                            <product-price :product="product"></product-price>
                        </div>

                        <div class="pvl"><hr></div>

                        <!-- Size -->
                        <div class="inlineBlock vat mbl" style="padding-right:40px;">
                            <div class="fwb">{{ $t('Size') }}</div>
                            <el-select v-model="selectedSize"
                                    :no-data-text="$t('Sorry this item does not have any sizes available')"
                                    placeholder="Select"
                                    class="width125">
                                <el-option
                                        v-for="size in sizeOptions"
                                        :key="size"
                                        :label="$t(size)"
                                        :value="size">
                                </el-option>
                            </el-select>
                        </div>

                        <!-- quantity -->
                        <div class="inlineBlock vat mbl">
                            <div class="fwb">{{ $t('Quantity') }}</div>
                            <div>
                                <div class="displayTableCell prl fs20 vam colorGreen fw600">{{ selectedQty }}</div>
                                <div class="displayTableCell">
                                    <number-buttons :step="1"
                                                    :min="1"
                                                    :max="product.inventory_count"
                                                    :init-value="1"
                                                    v-on:change="val => { selectedQty = val }"></number-buttons>
                                </div>
                            </div>
                        </div>

                        <div class="ptl">
                            <el-button type="warning"
                                    @click="addToCart"
                                    class="colorBlack"
                                    :loading="isLoading">{{ $t('ADD TO CART') }}</el-button>
                        </div>
                    </div>
                </div>

                <div class="social">
                    <!-- <social-sharing :url="siteUrl + '/product/share?id=' + product.id" -->
                    <social-sharing :url="pageUrl"
                                    :title="product.title"
                                    :description="product.title"
                                    hashtags="gmnst"
                                    :twitter-user="twitterUser"
                                    :media="mediaPicture"
                                    inline-template>
                        <div>
                            <network network="facebook">
                                <i class="fa fa-facebook" alt="Facebook"></i>
                            </network>
                            <network network="googleplus">
                                <i class="fa fa-google-plus" alt="Google+"></i>
                            </network>
                            <network network="pinterest">
                                <i class="fa fa-pinterest" alt="Pinterest"></i>
                            </network>
                            <network network="twitter">
                                <i class="fa fa-twitter" alt="Twitter"></i>
                            </network>
                        </div>
                    </social-sharing>
                </div>
            </div>
        </div>
    </default-layout>
</template>


<style lang="scss">
@import '../../assets/css/components/_variables.scss';

.prod-attributes-table {
    padding-top: 10px;

    .row {
        display: table-row;
    }

    .label {
        display: table-cell;
        padding: 0 20px 10px;
        font-weight: bold;
    }

    .value {
        display: table-cell;
        padding-bottom: 10px;
    }
}

.social {
    margin-top: 40px;
    text-align: center;

    .fa {
        font-size: 25px;
        margin-right: 20px;
        cursor: pointer;
    }
}

@media #{$medium-and-up} {
    .social {
        margin-top: 0;
        text-align: right;
    }
}
</style>
