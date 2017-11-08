<template>
    <div>
        <div v-if="!cart.num_items" class="fs16 tac pal">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>
        <div v-else class="ptl">
            <article v-for="item in cart.cart_items" 
                    :key="item.id" 
                    class="cartItem"
                    :class="{'highlight': highlightItem === item.id, 'fadeout': added_cart_item === item.id}" 
                    :id="'cartItem' + item.id">
                <div class="cartItemPic">
                    <figure class="image is-128x128">
                        <img v-bind:src="cartService.productPic(item)">
                    </figure>
                </div>

                <div class="cartItemInfo">
                    <div class="cartItemInfoContent">
                        <div class="cartItemMain">
                            <a class="itemTitle" @click="goToDetails(item.product.seo_uri)">{{ item.product.title }}</a>

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
    import ProductPrice from '../../components/product/ProductPrice'
    import NumberButtons from '../../components/NumberButtons'
    import { Select, Option, InputNumber, Loading, Button } from 'element-ui'
    import cartService from '../../util/cartService'

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

            highlightItem: {
                type: String,
                default: null
            }
        },

        components: {
            ProductPrice,
            NumberButtons
        },

        data() {
            return {
                added_cart_item: {},
                selectedQty: 0,
                loading: true,
                cartService: cartService
            }
        },

        computed: {
            ...mapGetters([
                'cart',
                'app'
            ])
        },

        methods: {
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

            goToDetails(seo_uri) {
                this.$router.push({
                    name: 'product_detail',
                    params: { itemId: seo_uri }
                });
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
        },

        mounted() {
            setTimeout(() => {
                this.added_cart_item = this.highlightItem;
            }, 1000)
        }
    }
</script>

<style>
</style>
