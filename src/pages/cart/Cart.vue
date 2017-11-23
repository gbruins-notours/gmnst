<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import { Button } from 'element-ui'
    import PageHeader from '../../components/PageHeader.vue'
    import CartItems from '../../components/cart/CartItems'
    import CartTotalsTable from '../../components/cart/CartTotalsTable'
    import KeepShoppingButton from '../../components/cart/KeepShoppingButton'

    Vue.use(Button);

    export default {
        components: {
            CartItems,
            CartTotalsTable,
            PageHeader,
            KeepShoppingButton
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
                            this.added_cart_item = item.id;
                        }
                    });
                }
            }
        }
    }
</script>


<template>
    <section>
        <page-header :title="$t('Shopping Cart')"></page-header>

        <div class="container">
            <div class="tac ptl" v-if="this.cart.cart_items && this.cart.cart_items.length > 2">
                <el-button type="warning"
                           class="colorBlack"
                           size="large"
                           @click="goToCheckout">{{ $t('PROCEED TO CHECKOUT') }}</el-button>
            </div>

            <div class="pam">
                <cart-items :highlight-item="added_cart_item"></cart-items>

                <div class="mtm clearfix">
                    <div class="floatRight">
                        <cart-totals-table :cart="cart"></cart-totals-table>
                    </div>
                </div>
            </div>

            <div class="tac mtl" v-if="this.cart.num_items">
                <el-button type="warning"
                           class="colorBlack"
                           size="large"
                           @click="goToCheckout">{{ $t('PROCEED TO CHECKOUT') }}</el-button>

               <div class="mvl colorGray">{{ $t('OR') }}</div>
            </div>

            <div class="tac">
                <keep-shopping-button></keep-shopping-button>
            </div>
        </div>
    </section>
</template>
