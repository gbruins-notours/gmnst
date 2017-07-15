<template>
    <section class="container">

        <div v-if="!this.cart.num_items" class="fs16 pal tac">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>

        <template v-else>
            <checkout-steps :step="2"></checkout-steps>

            <div class="g-spec no-zebra mbl">
                <div class="g-spec-label nowrap">{{ $t('Shipping Method') }}</div>
                <div class="g-spec-content">
                    SHIPPING METHOD GOES HERE


                    <div class="fs16 colorGray pbs">{{ $t('Shipping Address') }}:</div>
                    <div class="inlineBlock vat">
                        <shipping-view :show-details="true"></shipping-view>
                    </div>

                    <div class="inlineBlock vat pll">
                        <el-button type="text" @click="goToShipping">{{ $t('Edit Address') }}</el-button>
                    </div>

                    <div class="mtl">
                        <el-button type="warning" @click="goToPlaceOrder" class="colorBlack">{{ $t('Continue') }}</el-button>
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
    import CountrySelect from '../../components/CountrySelect.vue'
    import PageHeader from '../../components/PageHeader.vue'
    import ShippingView from '../../components/checkout/ShippingView.vue'
    import CheckoutSteps from '../../components/checkout/CheckoutSteps.vue'

    Vue.use(Button)

    export default {
        computed: {
            ...mapGetters([
                'cart'
            ])
        },

        components: {
            CountrySelect,
            PageHeader,
            ShippingView,
            CheckoutSteps
        },

        methods: {
            goToShipping: function() {
                this.$router.push({ name: 'checkout_shipping' });
            },
            goToPlaceOrder: function() {
                this.$router.push({ name: 'checkout_place_order' });
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>


<style>
</style>
