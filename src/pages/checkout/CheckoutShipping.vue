<template>
    <section class="container">

        <div v-if="!this.cart.num_items" class="fs16 pal tac">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>

        <template v-else>
            <checkout-steps :step="1"></checkout-steps>

            <div class="g-spec mbl">
                <div class="g-spec-label nowrap">1) {{ $t('Shipping') }}</div>
                <div class="g-spec-content">
                    <shipping-view :show-details="false"></shipping-view>

                    <div class="mtl">
                        <el-button type="warning" @click="goToShippingMethod" class="colorBlack">{{ $t('Continue') }}</el-button>
                    </div>
                </div>
            </div>
        </template>

    </section>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button } from 'element-ui'
    import PageHeader from '../../components/PageHeader.vue'
    import ShippingView from '../../components/checkout/ShippingView.vue'
    import CheckoutSteps from '../../components/checkout/CheckoutSteps.vue'

    Vue.use(Button)

    export default {
        computed: {
            ...mapGetters([
                'cart',
            ])
        },

        components: {
            PageHeader,
            ShippingView,
            CheckoutSteps
        },

        methods: {
            goToShippingMethod: function() {
                this.$router.push({ name: 'checkout_shipping_method' });
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>


<style></style>
