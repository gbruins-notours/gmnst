<template>
    <div>
        <div v-if="!this.cart.num_items" class="fs16 tac pal">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>
        <div v-else class="ptl">

            <article v-for="item in this.cart.cart_items" :key="item.id" class="cartItem" :id="'cartItem' + item.id">
                <div class="cartItemPic">
                    <figure class="image is-128x128">
                        <img v-bind:src="productPic(item)">
                    </figure>
                </div>

                <div class="cartItemInfo">
                    <div class="cartItemInfoContent">
                        <div class="cartItemMain">
                            <div class="fwb fs16">{{ item.product.title }}</div>

                            <div v-if="allowEdit" class="mts">
                                <el-button type="text" @click="removeItem(item.id)">{{ $t('Delete') }}</el-button>
                            </div>
                        </div>

                        <!-- Variants -->
                        <div class="cartItemCol">
                            <div v-if="item.variants && item.variants.size">
                                <label class="itemLabel">{{ $t('Size') }}:</label>
                                <div class="itemVal">{{ $t(item.variants.size) }}</div>
                            </div>
                        </div>
                        
                        <!-- Price -->
                        <div class="cartItemCol">
                            <label class="itemLabel">{{ $t('Price' )}}:</label>
                            <div class="itemVal"><product-price :product="item.product"></product-price></div>
                        </div>

                        <!-- Quantity -->
                        <div class="cartItemCol">
                            <label class="itemLabel">{{ $t('Quantity' )}}:</label>
                            <div v-if="allowEdit" class="itemVal">
                                <div class="displayTableCell prl fwb vat">{{ item.qty }}</div>
                                <div class="displayTableCell">
                                    <number-buttons :step="1"
                                                    :min="1"
                                                    :max="item.product.inventory_count"
                                                    :init-value="item.qty"
                                                    size="small"
                                                    v-on:change="function(val) { updateCartItemQuantity(item, val) }"></number-buttons>
                                </div>
                            </div>
                            <div v-else class="itemVal">
                                {{ item.qty }}
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <div class="mtm clearfix">
                <div class="floatRight">
                    <!-- subtotal -->
                    <div class="displayTableRow">
                        <div class="displayTableCell prl fwb tar">
                            {{ $t('Subtotal') }}
                            <span class="nowrap">({{ cart.num_items }} {{ $tc('items', cart.num_items) }})</span>:
                        </div>
                        <div class="displayTableCell tar mono">{{ cart.sub_total }}</div>
                    </div>

                    <!-- shipping -->
                    <div class="displayTableRow" v-if="showShippingCost">
                        <div class="displayTableCell prl fwb tar">{{ $t('Shipping') }}:</div>
                        <div class="displayTableCell tar mono">{{ cart.shipping_total }}</div>
                    </div>

                    <!-- sales tax -->
                    <div class="displayTableRow" v-if="showSalesTax">
                        <div class="displayTableCell prl fwb tar">{{ $t('Tax') }}:</div>
                        <div class="displayTableCell tar mono">{{ cart.sales_tax }}</div>
                    </div>

                    <!-- order total -->
                    <div class="displayTableRow" v-if="showShippingCost && showSalesTax">
                        <div class="displayTableCell prl fwb tar colorGreen fs16">{{ $t('Order total') }}:</div>
                        <div class="displayTableCell fwb tar colorGreen fs16 mono">{{ $n(cart.grand_total, 'currency') }}</div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
    import Promise from 'bluebird'
    import accounting from 'accounting'
    import Vue from 'vue'
    import api from '../../util/api'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import ProductPrice from '../../components/product/ProductPrice.vue'
    import NumberButtons from '../../components/NumberButtons.vue'
    import { Select, Option, InputNumber, Loading, Button } from 'element-ui'

    Vue.use(Select);
    Vue.use(Option);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.use(Loading.directive)

    export default {
        props: {
            allowEdit: {
                type: Boolean,
                default: true
            },

            showShippingCost: {
                type: Boolean,
                default: false
            },

            showSalesTax: {
                type: Boolean,
                default: false
            },
        },

        data() {
            return {
                added_cart_item: {},
                selectedQty: 0,
                loading: true
            }
        },

        components: {
            ProductPrice,
            NumberButtons
        },

        computed: {
            ...mapGetters([
                'cart',
                'app'
            ])
        },

        methods: {
            productPic(cartItem) {
                if (cartItem.product.featured_pic) {
                    return '/static/images/product/' + cartItem.product.featured_pic;
                }
                return;
            },

            updateCartItemQuantity(item, qty) {
                let loadingInstance = Loading.service({ target: '#cartItem' + item.id });

                this.$store.dispatch('CART_ITEM_SET_QTY', {
                    id: item.id,
                    qty
                }).then(() => {
                    item.qty = qty;
                    loadingInstance.close();
                })
            },

            removeItem(id) {
                let loadingInstance = Loading.service({ target: '#cartItem' + id });

                this.$store.dispatch('CART_ITEM_DELETE', {
                    id
                }).then(() => {
                    loadingInstance.close();
                });
            },

            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push({
                        name: 'product_detail',
                        params: { itemId: this.product.seo_uri }
                    });
                }
            },

            goToCheckout() {
                this.$router.push({ name: 'checkout' });
            },

            goToProductList() {
                  //TODO: get the type of the 'added_cart_item' product and
                  // send the user back to the list page for that type,
                  // else to home page (?)
                  this.$router.push('/type/' + app.seoUri[key]);
            }
        }
    }
</script>

<style lang="scss">
    @import '../../assets/css/components/_variables.scss';
    @import '../../assets/css/components/_mixins.scss';

    .cartItem {
        width: 100%;
        margin-bottom: 20px;
        @include box-shadow(0px, 1px, 2px, rgba(0,0,0,.1))
    }

    .cartItemPic {
        display: table-cell;
        overflow: hidden;
        background-color: #000;
    }

    .cartItemInfo {
        display: table-cell;
        vertical-align: top;
        width:100%;
        background-color: #fff;
    }

    .cartItemInfoContent {
        display: block;
        padding: 5px 10px;
    }

    .cartItemMain {
        flex-grow: 1;
        padding-bottom: 5px;
    }

    .cartItemCol {
        display: block;
        margin-left: 0;

        .itemLabel,
        .itemVal {
            display: table-cell;
            padding: 0 10px 3px 0;
        }
        .itemLabel {
            width: 80px;
            word-wrap: break-word;
            font-size: 11px;
        }
        .itemVal {
            font-weight: bold;
        }
    }

// @media all and (min-width: $small-screen-up) {
@media #{$medium-and-up} {
        .cartItemInfoContent {
            padding: 10px 15px;

            display: -webkit-flex; /* Safari */
            display: flex;
            -webkit-flex-direction: row; /* Safari */
            flex-direction: row;

            -webkit-flex-wrap: nowrap;
            flex-wrap: nowrap;

            -webkit-justify-content: flex-start;
            justify-content: flex-start;
        }

        .cartItemMain {
            flex-grow: 1;
        }

        .cartItemCol {
            flex-grow: 0;
            margin-left: 20px;

            .itemLabel,
            .itemVal {
                display: block;
                width: 100%;
            }
        }
}
</style>
