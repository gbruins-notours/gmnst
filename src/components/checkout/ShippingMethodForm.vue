<template>
    <section class="container">

        <div class="delivery-options"
            v-loading="isLoading"
            :element-loading-text="$t('Shipping options are loading')">

            <!-- <div class="fs16 fwb mbm">{{ $t('Choose a delivery option') }}:</div> -->

            <div v-if="checkout.shippingMethods" v-for="rate in shippingRates">
                 <el-radio class="radio" v-model="seletedShippingRate" :label="rate.rate_id">
                     <span class="colorGreen fwb">delivery: {{ rate.estimated_delivery_date }} {{ shippingDateDisplay(rate.estimated_delivery_date) }}</span>
                     <div style="margin-left:25px">some other info</div>
                </el-radio>
            </div>
        </div>

        <div class="shipping-address">
            <div class="fs14 fwb pbs">
                {{ $t('Shipping address') }}:&nbsp;&nbsp;&nbsp;<el-button type="text" @click="goToShipping">{{ $t('Change') }}</el-button>
            </div>
            <shipping-view></shipping-view>
            <!-- <el-button type="text" @click="goToShipping">{{ $t('Edit Address') }}</el-button> -->
        </div>

        <div class="mtl">
            <el-button type="warning" @click="submitForm" class="colorBlack">{{ $t('Continue') }}</el-button>
        </div>

    </section>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button, Loading, RadioGroup, Radio } from 'element-ui'
    import CountrySelect from '../../components/CountrySelect.vue'
    import ShippingView from '../../components/checkout/ShippingView.vue'
    import api from '../../util/api'
    import isObject from 'lodash.isobject'

    Vue.use(Button);
    Vue.use(RadioGroup);
    Vue.use(Radio);

    export default {
        components: {
            CountrySelect,
            ShippingView,
        },

        data: function() {
            return {
                shippingRates: [],
                seletedShippingRate: null
            }
        },

        computed: {
            ...mapGetters([
                'cart',
                'checkout'
            ]),

            isLoading: function() {
                if(!this.checkout.shippingMethods) {
                    return true;
                }
                else {
                    let rates = isObject(this.checkout.shippingMethods.rate_response) ? this.checkout.shippingMethods.rate_response.rates : [];
                    let shippingRates = [];

                    rates.forEach((rate) => {
                        
                    })
                    this.shippingRates = isObject(this.checkout.shippingMethods.rate_response) ? this.checkout.shippingMethods.rate_response.rates : [];
                    console.log("this.shippingRates", this.shippingRates)
                    return false;
                }
            }
        },

        methods: {
            goToShipping: function() {
                this.$emit('shipping_method_go_back')
            },

            shippingDateDisplay: function(estimatedDate) {
                console.log("estimatedDate", estimatedDate)
                let d = new Date(estimatedDate);
                var userTimezoneOffset = d.getTimezoneOffset() * 60000;
                var d2 = new Date(d.getTime() + userTimezoneOffset);

                // advance one day
                d2.setDate(d2.getDate() + 1);

                return this.$d(d2, 'short');




                // let d = new Date(estimatedDate);
                // let seconds = d.getSeconds();
                // // console.log("d", d)
                // // console.log("to time", d.getTime())
                //
                // let d2 = new Date(estimatedDate);
                // // console.log('d2 plus one day', d2.setDate(d2.getDate() + 1))
                // // console.log('d2', d2);
                // // console.log('d2 toUTCString', d2.toUTCString())
                // // console.log("to string", d.toUTCString())
                // // console.log("to time string", d.toTimeString())
                // // console.log("seconds", seconds)
                // // let str = this.$d(new Date(seconds), 'short')
                // // console.log("not utc", this.$d(d, 'short'));
                // // console.log('utc', str)
                // console.log("parsed", new Date(estimatedDate).toUTCString())
                // console.log('=======')
                // return this.$d(new Date(estimatedDate), 'short');
            },

            submitForm: function() {
                if(!this.submitButtonDisabled) {
                    this.$emit('shipping_method_submit')
                }
            }
        }
    }
</script>


<style lang="scss">
    .delivery-options {
        padding-right: 100px;
    }

    .delivery-options,
    .shipping-address {
        display: inline-block;
        vertical-align: top;
        padding-bottom: 10px;
    }

</style>
