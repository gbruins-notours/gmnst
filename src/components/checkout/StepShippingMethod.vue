<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button, Notification, Loading, Radio } from 'element-ui'
    import forEach from 'lodash.foreach'
    import ShoppingCartService from '@/pages/cart/shopping_cart_service.js'

    Vue.use(Button)
    Vue.use(Radio)
    Vue.use(Loading.directive)
    Vue.prototype.$notify = Notification;

    let shoppingCartService = new ShoppingCartService();

    export default {
        data: function() {
            return {
                shippingRates: [],
                selectedRate: null,
                isLoading: true
            }
        },

        computed: {
            ...mapGetters([
                'cart'
            ])
        },

        methods: {
            submitShippingMethodForm: function() {
                //TODO: finish this method
                console.log("submitShippingMethodForm")
                this.$emit('done', 'shipping-method-step')
            },

            getShippingRates: function() {
                // this.$store.dispatch('CART_SHIPPING_METHODS', null);
                shoppingCartService.getShippingRates({
                    validate_address: 'no_validation',
                    ship_to: {
                        address_line1: this.cart.shipping_streetAddress,
                        city_locality: this.cart.shipping_city,
                        state_province: this.cart.shipping_state,
                        postal_code: this.cart.shipping_postalCode,
                        country_code: this.cart.shipping_countryCodeAlpha2
                    },
                    packages: [
                        {
                            weight: {
                                value: '6.0',  //TODO
                                unit: 'ounce'
                            }
                        }
                    ]
                })
                .then((result) => {
                    // this.$store.dispatch('CART_SHIPPING_METHODS', result);
                    // pre-select the lowest rate:
                    let lowestRate = null;
                    let lowestId = null;

                    forEach(result, (rate) => {
                        if(!lowestRate || (rate.shipping_amount.amount < lowestRate)) {
                            lowestRate = rate.shipping_amount.amount;
                            lowestId = rate.rate_id
                        }
                    });

                    this.selectedRate = lowestId;
                    this.shippingRates = result;
                })
                .catch((result) => {
                    currentNotification = this.$notify({
                        title: this.$t('An error occurred'),
                        message: 'We were unable to get shipping rates because of a server error.',
                        duration: 0,
                        type: 'error'
                    });
                })
                .finally(() => {
                    this.isLoading = false;
                });
            },
        },

        created: function() {
            console.log("created shipping method")
            this.getShippingRates();
        }
    }
</script>

<template>
    <div>
        <div class="step-title">{{ $t('SHIPPING METHOD') }}:</div>

        <div v-loading="isLoading" :element-loading-text="$t('Loading...')" class="mtl tac">
            <div class="inlineBlock">
                <div v-for="rate in shippingRates" :key="rate.rate_id" class="displayTableRow">
                    <div class="displayTableCell vat fs20 tal">
                        <el-radio v-model="selectedRate" :label="rate.rate_id">&nbsp;</el-radio>
                    </div>
                    <div class="displayTableCell vat pbl pls pts tal cursorPointer" @click="selectedRate = rate.rate_id">
                        <div class="fwb fs16 inlineBlock mrs">{{ $n(rate.shipping_amount.amount, 'currency') }}</div>
                        <div class="inlineBlock">{{ $t(`shipping.${rate.service_code}.desc`) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="ptl tac">
            <div class="inlineBlock">
                <el-button type="warning"
                            class="colorBlack"
                            @click="submitShippingMethodForm"
                            size="large">{{ $t('CONTINUE TO PAYMENT') }}</el-button>
            </div>
        </div>
    </div>
</template>