<template>
    <section>
        <page-header :title="$t('Shopping Cart')">
            <span class="is-8 pll" v-if="this.cart.num_items">
                <el-button type="warning" @click="goToCheckout" class="colorBlack">{{ $t('Proceed to checkout') }}</el-button>
            </span>
        </page-header>

        <div class="container">
            <div class="pam">
                <cart-items></cart-items>
            </div>

            <div class="tac pal" v-if="this.cart.num_items">
                <el-button type="warning"
                           class="colorBlack"
                           size="large"
                           @click="goToCheckout">{{ $t('Proceed to checkout') }}</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import { Notification } from 'element-ui'
    import PageHeader from '../../components/PageHeader.vue'
    import CartItems from '../../components/cart/CartItems'

    export default {
        components: {
            CartItems,
            PageHeader
        },

        computed: {
            ...mapGetters([
                'cart'
            ])
        },

        data: function() {
            return {
                added_cart_item: null
            }
        },

        methods: {
            goToCheckout() {
                this.$router.push({ name: 'checkout_shipping' });
            },
        },

        created() {
            if(this.$route.params.id) {
                console.log("CART", this.cart);

                if(isObject(this.cart) && Array.isArray(this.cart.cart_items)) {
                    this.cart.cart_items.forEach((item) => {
                        if(item.product_id === this.$route.params.id) {
                            this.added_cart_item = item;

                            Notification.success({
                                title: this.$t('Cart updated!'),
                                duration: 3000
                            });
                        }
                    });
                }
            }

        }
    }
</script>

<style lang="scss">
</style>
