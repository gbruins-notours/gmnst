<template>
    <section class="container">

        <div class="g-spec no-zebra mbl">
            <div class="g-spec-label nowrap">{{ $t('Shipping method') }}</div>
            <div class="g-spec-content">
                SHIPPING METHOD GOES HERE

                <div class="fs16 colorGray pbs">{{ $t('Shipping Address') }}:</div>
                <div class="inlineBlock vat">
                    <shipping-view></shipping-view>
                </div>

                <div class="inlineBlock vat pll">
                    <el-button type="text" @click="goToShipping">{{ $t('Edit Address') }}</el-button>
                </div>

                <div class="mtl">
                    <el-button type="warning" @click="submitForm" class="colorBlack">{{ $t('Continue') }}</el-button>
                </div>
            </div>
        </div>

    </section>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button } from 'element-ui'
    import CountrySelect from '../../components/CountrySelect.vue'
    import ShippingView from '../../components/checkout/ShippingView.vue'

    Vue.use(Button)

    export default {
        components: {
            CountrySelect,
            ShippingView,
        },

        methods: {
            goToShipping: function() {
                this.$emit('shipping_method_go_back')
            },

            submitForm: function() {
                if(!this.submitButtonDisabled) {
                    this.$emit('shipping_method_submit')
                }
            }
        }
    }
</script>


<style>
</style>
