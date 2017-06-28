<template>
    <section>
        <div class="columns pam">
            <div class="column is-8">
                <div class="title">{{ $t('Shopping Cart') }}</div>
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
                        <strong>{{ item.product.title }}</strong>

                        <div>
                            Size:&nbsp;TODO
                        </div>

                        <div><a @click="removeItem(item.id)">{{ $t('Delete') }}</a></div>
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

                <div class="cartItemsFooter">
                    <span></span>
                    <span class="tar fwb">{{ $t('Subtotal') }} ({{ cart.num_items }} {{ $tc('items', cart.num_items) }}):</span>
                    <span class="tar fwb">{{ subtotal }}</span>
                    <span></span>
                </div>
            </div>

            <div>
                <button class="delete" @click="goToProductList"></button>
                <button @click="goToCheckout"></button>
            </div>
        </template>
    </section>
</template>

<script>
    import Promise from 'bluebird'
    import accounting from 'accounting'
    import Vue from 'vue'
    import api from '../../util/api'
    import { mapGetters, mapActions } from 'vuex'
    import isObject from 'lodash.isobject'
    import ProductPrice from '../../components/product/ProductPrice.vue'
    import { Select, Option, InputNumber, Loading } from 'element-ui'

    Vue.use(Select);
    Vue.use(Option);
    Vue.use(InputNumber);
    Vue.use(Loading.directive)

//    let loadingInstance = Loading.service({ fullscreen: true, body: true });
//    loadingInstance.open();

//    Vue.prototype.$loading = Loading.service

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
            ...mapActions([
                'CART_ITEM_SET_QTY',
                'CART_ITEM_DELETE'
            ]),

            productPic(cartItem) {
                if (cartItem.product.featured_pic) {
                    return '/static/images/product/' + cartItem.product.featured_pic;
                }
                return;
            },

            updateCartItemQuantity(id, qty) {
                console.log('updateCartItemQuantity', id, qty);

//                let loadingInstance = this.$loading({ fullscreen: true });
                let loadingInstance = Loading.service({ target: '#cartItems' });

                this.CART_ITEM_SET_QTY({
                    id,
                    qty
                }).then(() => {
                    loadingInstance.close();
                })
            },

            removeItem(id) {
                this.CART_ITEM_DELETE({
                    id
                })
            },

            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push(`/item/${this.product.seo_uri}`);
                }
            },

            goToCheckout() {
                  this.$router.push(`/checkout`);
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
        }
    }
</script>

<style lang="scss">

.cartItems {
    display: table;
    /*border-collapse:separate;*/
    /*border-spacing:10px;*/
    width: 100%;
}

.cartItemsHeader {
    border-bottom: 1px solid #ccc;
}

.cartItemsHeader,
.cartItemsFooter,
.cartItem {
    display: table-row;
}

.cartItemsHeader > span,
.cartItemsFooter > span,
.cartItemCell {
    display: table-cell;
    vertical-align: top;
    /*border: 1px solid blue;*/
    padding: 2px 5px;
}

.cartItemCell {
    border-top: 1px solid #dfdedf;
}

@media all and (min-width: 42em) {
    .cartItemCell {
        padding: 5px 10px;
    }
}
</style>
