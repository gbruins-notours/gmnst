<template>
    <div>
        <div v-if="!this.cart.num_items" class="fs16 tac pal">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>
        <div v-else>
            <div class="cartItems" id="cartItems">
                <div class="cartItemsHeader">
                    <span></span>
                    <span></span>
                    <span class="width100 tar">{{ $t('Price') }}</span>
                    <span class="width200 tar">{{ $t('Quantity') }}</span>
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
                        <div v-if="allowEdit" class="mtl">
                            <el-button type="text" @click="removeItem(item.id)">{{ $t('Delete') }}</el-button>
                        </div>
                    </div>

                    <!-- Price -->
                    <div class="cartItemCell fwb tar">
                        <product-price :product="item.product"></product-price>
                    </div>

                    <!-- Quantity -->
                    <div class="cartItemCell tar">
                        <div v-if="allowEdit" class="inlineBlock">
                            <div class="displayTableCell prl fwb vam">{{ item.qty }}</div>
                            <div class="displayTableCell">
                                <number-buttons :step="1"
                                                :min="1"
                                                :max="item.product.inventory_count"
                                                :init-value="item.qty"
                                                size="small"
                                                v-on:change="function(val) { updateCartItemQuantity(item, val) }"></number-buttons>
                            </div>
                        </div>
                        <div v-else class="fwb">
                            {{ item.qty }}
                        </div>
                    </div>
                </article>
            </div>

            <div class="mtm clearfix">
                <div class="floatRight">
                    <!-- subtotal -->
                    <div class="displayTableRow">
                        <div class="displayTableCell prl fwb tar">
                            {{ $t('Subtotal') }}
                            <span class="nowrap">({{ cart.num_items }} {{ $tc('items', cart.num_items) }})</span>:
                        </div>
                        <div class="displayTableCell tar">{{ $n(cart.sub_total, 'currency') }}</div>
                    </div>

                    <!-- shipping -->
                    <div class="displayTableRow" v-if="showShippingCost">
                        <div class="displayTableCell prl fwb tar">{{ $t('Shipping') }}:</div>
                        <div class="displayTableCell tar">{{ $n(cart.shipping_total, 'currency') }}</div>
                    </div>

                    <!-- sales tax -->
                    <div class="displayTableRow" v-if="showSalesTax">
                        <div class="displayTableCell prl fwb tar">{{ $t('Tax') }}:</div>
                        <div class="displayTableCell tar">{{ $n(cart.sales_tax, 'currency') }}</div>
                    </div>

                    <!-- order total -->
                    <div class="displayTableRow" v-if="showShippingCost && showSalesTax">
                        <div class="displayTableCell prl fwb tar colorGreen fs16">{{ $t('Order total') }}:</div>
                        <div class="displayTableCell fwb tar colorGreen fs16">{{ $n(cart.grand_total, 'currency') }}</div>
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
                console.log('updateCartItemQuantity');
                let loadingInstance = Loading.service({ target: '#cartItems' });

                this.$store.dispatch('CART_ITEM_SET_QTY', {
                    id: item.id,
                    qty
                }).then(() => {
                    item.qty = qty;
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

.cartItems {
    display: table;
    width: 100%;
}

.cartItemsHeader,
.cartItem {
    display: table-row;

    // &:nth-child(even) {
    //     background-color: $bgGrayZebra;
    // }
}

.cartItemCell {
    border-top: 1px solid $borderColorGray;
}

.cartItemsHeader > span,
.cartItemCell {
    display: table-cell;
    vertical-align: top;
    padding: 10px;
}
</style>
