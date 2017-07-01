<template>
    <section>
        <div class="container">
            <div class="columns pam">
                <div class="column is-2">
                    <div class="title wordwrap">{{ $t('Shopping Cart') }}</div>
                </div>
                <div class="column is-10">
                    <el-button type="warning" @click="goToCheckout" class="colorBlack">{{ $t('Proceed to checkout') }}</el-button>
                </div>
            </div>

            <!--<div v-if="added_cart_item ">-->
                <!--{{ $t('Added to Cart') }}:-->
            <!--</div>-->

            <div v-if="!this.cart.num_items" class="fs16">
                {{ $t('Your shopping cart does not contain any items.') }}
            </div>

            <template v-else>
                <div class="cartItems" id="cartItems">
                    <div class="cartItemsHeader">
                        <span></span>
                        <span></span>
                        <span class="width100 tac">{{ $t('Price') }}</span>
                        <span class="width100 tac">{{ $t('Quantity') }}</span>
                    </div>

                    <article class="cartItem" v-for="item in this.cart.cart_items" :key="item.id">
                        <figure class="cartItemCell image is-128x128">
                            <img v-bind:src="productPic(item)">
                        </figure>

                        <div class="cartItemCell">
                            <div class="fwb mbs fs16">{{ item.product.title }}</div>

                            <!-- Variants -->
                            <template v-if="item.variants && item.variants.size">
                                <div class="displayTableRow">
                                    <div class="displayTableCell prm">{{ $t('Size') }}:</div>
                                    <div class="displayTableCell">{{ $t(item.variants.size) }}</div>
                                </div>
                            </template>

                            <!-- <div><a class="colorGray" @click="removeItem(item.id)">{{ $t('Delete') }}</a></div> -->
                            <div class="mtl">
                                <el-button type="text" @click="removeItem(item.id)">{{ $t('Delete') }}</el-button>
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="cartItemCell fwb tar">
                            <product-price :product="item.product"></product-price>
                        </div>

                        <!-- Quantity -->
                        <div class="cartItemCell tac">
                            <el-input-number v-model="item.qty"
                                             :step="1"
                                             :min="1"
                                             :max="item.product.inventory_count"
                                             size="small"
                                             :debounce="300"
                                             :controls="false"
                                             v-on:change="function(val) { updateCartItemQuantity(item.id, val) }"
                                             class="width50"></el-input-number>
                        </div>
                    </article>

                    <div class="cartItem">
                        <span class="cartItemCell"></span>
                        <span class="cartItemCell tar fwb">{{ $t('Subtotal') }} ({{ cart.num_items }} {{ $tc('items', cart.num_items) }}):</span>
                        <span class="cartItemCell tar fwb">{{ subtotal }}</span>
                        <span class="cartItemCell"></span>
                    </div>
                </div>

                <div class="mtl tac">
                    <!-- <button class="delete" @click="goToProductList"></button> -->
                    <el-button type="warning" @click="goToCheckout" class="colorBlack">{{ $t('Proceed to checkout') }}</el-button>
                </div>
            </template>

        </div>
    </section>
</template>

<script>
    import Promise from 'bluebird'
    import accounting from 'accounting'
    import Vue from 'vue'
    import api from '../../util/api'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import ProductPrice from '../../components/product/ProductPrice.vue'
    import { Select, Option, InputNumber, Loading, Button } from 'element-ui'

    Vue.use(Select);
    Vue.use(Option);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.use(Loading.directive)

    export default {
        props: ['id'],

        data() {
            return {
                added_cart_item: {},
                selectedQty: 0,
                loading: true
            }
        },

        components: {
            ProductPrice
        },

        computed: {
            ...mapGetters([
                'cart',
                'appInfo'
            ]),

            subtotal() {
                return accounting.formatMoney(this.cart.sub_total)
            }
        },

        methods: {
            productPic(cartItem) {
                if (cartItem.product.featured_pic) {
                    return '/static/images/product/' + cartItem.product.featured_pic;
                }
                return;
            },

            updateCartItemQuantity(id, qty) {
                let loadingInstance = Loading.service({ target: '#cartItems' });

                this.$store.dispatch('CART_ITEM_SET_QTY', {
                    id,
                    qty
                }).then(() => {
                    loadingInstance.close();
                })
            },

            removeItem(id) {
                this.$store.dispatch('CART_ITEM_DELETE', {
                    id
                });
            },

            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push(`/item/${this.product.seo_uri}`);
                }
            },

            goToCheckout() {
                  this.$router.push({ name: 'cart_checkout' });
            },

            goToProductList() {
                  //TODO: get the type of the 'added_cart_item' product and
                  // send the user back to the list page for that type,
                  // else to home page (?)
                  this.$router.push('/type/' + appInfo.seoUri[key]);
            }
        },

        created() {
            if(this.$route.params.id) {
                console.log("CART", this.cart);

                if(isObject(this.cart) && Array.isArray(this.cart.cart_items)) {
                    this.cart.cart_items.forEach((item) => {
                        if(item.product_id === this.$route.params.id) {
                            this.added_cart_item = item;
                        }
                    });
                }
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>

<style lang="scss">
@import '../../assets/css/components/_variables.scss';

.cartItems {
    display: table;
    width: 100%;
}

.cartItemsHeader {
    border-bottom: 1px solid #ccc;
}

.cartItemsHeader,
.cartItem {
    display: table-row;

    &:nth-child(even) {
        background-color: $background_color_gray;
    }
}

.cartItemsHeader > span,
.cartItemCell {
    display: table-cell;
    vertical-align: top;
    padding: 10px;
}
</style>
