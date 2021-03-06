<script>
    import accounting from 'accounting'
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import { Select, Option, InputNumber, Loading, Button } from 'element-ui'
    import ProductPrice from '@/components/product/ProductPrice'
    import NumberButtons from '@/components/NumberButtons'
    import ShoppingCartService from '@/pages/cart/ShoppingCartService.js'
    import ProductService from '@/pages/product/ProductService.js'

    let shoppingCartService = new ShoppingCartService();
    let productService = new ProductService();

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
                productService: productService
            }
        },

        computed: {
            ...mapGetters({
                shoppingCart: 'cart/cart'
            })
        },

        methods: {
            updateCartItemQuantity(item, qty) {
                let loadingInstance = Loading.service({ target: `#cartItem${item.id}` });

                shoppingCartService
                    .updateItemQty({
                        id: item.id,
                        qty
                    })
                    .then((cartData) => {
                        this.$store.dispatch('cart/CART_SET', cartData);
                        item.qty = qty;
                        loadingInstance.close();
                    });
            },

            removeItem(id) {
                let loadingInstance = Loading.service({ target: `#cartItem${id}` });

                shoppingCartService
                    .deleteItem({
                        id
                    })
                    .then((cartData) => {
                        this.$store.dispatch('cart/CART_SET', cartData);
                        loadingInstance.close();
                    });
            },

            goToDetails(seo_uri) {
                this.$router.push({
                    name: 'product_detail',
                    params: { itemId: seo_uri }
                });
            }
        },

        mounted() {
            setTimeout(() => {
                this.added_cart_item = this.highlightItem;
            }, 1000)
        }
    }
</script>


<template>
    <div>
        <div v-if="!shoppingCart.num_items" class="fs16 tac pal">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>
        <div v-else class="ptl">
            <article v-for="item in shoppingCart.cart_items" 
                    :key="item.id" 
                    class="cartItem"
                    :class="{'highlight': highlightItem === item.id, 'fadeout': added_cart_item === item.id}" 
                    :id="'cartItem' + item.id">
                <div class="cartItemPic">
                    <figure class="image is-128x128">
                        <img v-bind:src="productService.featuredProductPic(item.product)">
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