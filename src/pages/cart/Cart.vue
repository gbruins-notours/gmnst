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

        <div class="cartItems">
            <div class="cartItemsHeader">
                <span></span>
                <span>{{ $t('Price') }}</span>
                <span>{{ $t('Quantity') }}</span>
            </div>

            <template v-for="item in this.cart.cart_items">
                <!-- <cart-item :item="item" :key="item.id"></cart-item> -->
                <article class="cartItem">
                      <figure class="cartItemCell image is-128x128">
                          <img v-bind:src="productPic">
                      </figure>

                      <div class="cartItemCell">
                          <strong>{{ item.product.title }}</strong>

                          <div class="level">
                              <div class="level-left">
                                  <div class="level-item">
                                      <small>Size:</small>&nbsp;
                                      TODO
                                  </div>
                              </div>
                          </div>

                          <div><a @click="removeItem(item.id)">{{ $t('Delete') }}</a></div>
                      </div>

                      <!-- Price -->
                      <div class="cartItemCell">
                          <product-price :product="item.product"></product-price>
                      </div>

                      <!-- Quantity -->
                      <div class="cartItemCell">
                          <number-select :min="1"
                                         :max="item.product.inventory_count"
                                         :initialize="item.qty"
                                         v-on:number_select_changed="function(val) { updateCartItemQuantity(item.id, val) }"></number-select>
                      </div>
                </article>
            </template>
        </div>

        <div class="tar fwb">
            {{ $t('Subtotal') }} ({{ cart.num_items }} {{ $tc('items', cart.num_items) }}): {{ subtotal }}
        </div>

        <div>
            <button class="delete" @click="goToProductList"></button>
            <button @click="goToCheckout"></button>
        </div>
    </section>
</template>

<script>
    import Promise from 'bluebird'
    import accounting from 'accounting'
    //import Vue from 'vue'
    import api from '../../util/api'
    import { mapGetters, mapActions } from 'vuex'
    import isObject from 'lodash.isobject'
    import CartItem from '../../components/cart/CartItem.vue'
    import NumberSelect from '../../components/NumberSelect.vue'
    import ProductPrice from '../../components/product/ProductPrice.vue'

    export default {
        props: ['id'],

        data() {
            return {
                added_cart_item: {}
            }
        },

        components: {
            ProductPrice,
            NumberSelect
        },

        computed: {
            ...mapGetters([
                'cart',
                'appInfo'
            ]),

            productPic() {
                if (this.item.product.featured_pic) {
                    return '/static/images/product/' + this.item.product.featured_pic;
                }
                return;
            },

            subtotal() {
                return accounting.formatMoney(this.cart.sub_total)
            }
        },

        methods: {
            ...mapActions([
                'CART_ITEM_SET_QTY',
                'CART_ITEM_DELETE'
            ]),

            productPic() {
                if (this.item.product.featured_pic) {
                    return '/static/images/product/' + this.item.product.featured_pic;
                }
                return;
            },

            updateCartItemQuantity(id, qty) {
                this.CART_ITEM_SET_QTY({
                    id,
                    qty
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
            }

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

  .cartItemsHeader {
    border-bottom: 1px solid #ccc;
  }

  .cartItemsHeader,
  .cartItem {
    display: table-row;

    .cartItemsHeader > span,
    .cartItemCell {
      display: table-cell;
    }
  }
}
</style>
