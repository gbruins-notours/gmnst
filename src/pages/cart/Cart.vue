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

        <div v-for="item in this.cart.cart_items">
            <cart-item :item="item" :key="item.id"></cart-item>
        </div>

        <div class="tar fwb">
            {{ $t('Subtotal') }} ({{ cart.num_items }} {{ $tc('items', cart.num_items) }}): {{ subtotal }}
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
    import CartItem from '../../components/cart/CartItem.vue'

    export default {
        props: ['id'],

        data() {
            return {
                added_cart_item: {}
            }
        },

        components: {
            CartItem
        },

        computed: {
            ...mapGetters([
                'cart'
            ]),

            subtotal() {
                return accounting.formatMoney(this.cart.sub_total)
            }
        },

        methods: {
            productPic() {
                if (this.item.product.featured_pic) {
                    return '/static/images/product/' + this.item.product.featured_pic;
                }
                return;
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
</style>

