<template>
    <section>
        <page-header :title="$t('Shopping Cart')"></page-header>

        <div class="container">
            <div class="tac ptl" v-if="this.cart.num_items > 2">
                <el-button type="warning"
                           class="colorBlack"
                           size="large"
                           @click="goToCheckout">{{ $t('Proceed to checkout') }}</el-button>
            </div>

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
                this.$router.push({ name: 'checkout' });
            },
        },

        created() {
            if(this.$route.params.id) {
                if(isObject(this.cart) && Array.isArray(this.cart.cart_items)) {
                    this.cart.cart_items.forEach((item) => {
                        if(item.product_id === this.$route.params.id) {
                            this.added_cart_item = item;

                            Notification.success({
                                title: this.$t('Cart updated!'),
                                duration: 2000
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
