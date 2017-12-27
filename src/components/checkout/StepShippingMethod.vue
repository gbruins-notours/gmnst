<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button, Notification, Loading, Radio } from 'element-ui'
    import forEach from 'lodash.foreach'
    import isObject from 'lodash.isobject'
    import cloneDeep from 'lodash.clonedeep'
    import Promise from 'bluebird';
    import PageHeader from '@/components/PageHeader'
    import ShoppingCartService from '@/pages/cart/shopping_cart_service.js'

    Vue.use(Button)
    Vue.use(Radio)
    Vue.use(Loading.directive)
    Vue.prototype.$notify = Notification;

    let shoppingCartService = new ShoppingCartService();
    let currentNotification = null;

    export default {
        components: {
            PageHeader
        },

        data: function() {
            return {
                shippingRates: [],
                selectedRate: null,
                isLoading: false
            }
        },

        computed: {
            ...mapGetters([
                'cart',
                'getShippingRateCache'
            ])
        },

        methods: {
            submitShippingMethodForm: function() {
                let r = null;

                forEach(this.shippingRates, (rate) => {
                    if(rate.rate_id === this.selectedRate) {
                        r = rate;
                    }
                });

                if(!r) {
                    currentNotification = this.$notify({
                        title: this.$t('Please select a shipping method'),
                        message: 'Thanks!',
                        duration: 0,
                        type: 'error'
                    });
                }
                else {
                    this.isLoading = true;

                    shoppingCartService
                        .setShippingRate(r)
                        .then((shoppingCart) => {
                            this.$store.dispatch('CART_SET', shoppingCart).then(() => {
                                this.$emit('done', 'shipping-method-step') ;
                                this.isLoading = false;
                            });
                        })
                        .catch(() => {
                            this.isLoading = false;
                            currentNotification = this.$notify({
                                title: this.$t('An error occurred'),
                                message: '',
                                duration: 0,
                                type: 'error'
                            });
                        })
                }
            },

            getShippingRates: function() {
                return new Promise((resolve, reject) => {
                    if(this.getShippingRateCache.cache) {
                        resolve(this.getShippingRateCache.cache)
                    }
                    else {
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
                            this.$store.dispatch('CART_SET_SHIPPING_RATES_CACHE', result);
                            resolve(result);
                        })
                        .catch((result) => {
                            let msg = 'We were unable to get shipping rates because of a server error.'
                            
                            currentNotification = this.$notify({
                                title: this.$t('An error occurred'),
                                message: msg,
                                duration: 0,
                                type: 'error'
                            });

                            reject(msg);
                        })
                    }
                });
            },

            processShippingRates: function() {
                // this.isLoading = true;

                // Get rates from cache if available.  If not then getting fresh rates.  
                // Then pre-selecting either the previously selected rate or the lowest rate
                // returned from the API response
                this.getShippingRates().then((result) => {
                    let lowestRate = null;
                    let lowestId = null;
                    let allRateIds = [];

                    forEach(result, (rate) => {
                        if(!lowestRate || (rate.shipping_amount.amount < lowestRate)) {
                            lowestRate = rate.shipping_amount.amount;
                            lowestId = rate.rate_id;
                            allRateIds.push(rate.shipping_amount.rate_id);
                        }
                    });

                    if(isObject(this.cart) 
                        && isObject(this.cart.shipping_rate) 
                        && allRateIds.indexOf(this.cart.shipping_rate.rate_id) > -1) {
                        this.selectedRate = this.cart.shipping_rate.rate_id;
                    }
                    else {
                        this.selectedRate = lowestId;
                    }

                    this.shippingRates = result;
                    this.isLoading = false;
                });
            },
        },

        created: function() {
            this.processShippingRates();
        }
    }
</script>

<template>
    <div>
        <page-header :title="$t('Shipping method') + ':'"></page-header>

        <div v-loading="isLoading" class="mtl tac">
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
                            :disabled="!selectedRate"
                            size="large">{{ $t('CONTINUE TO PAYMENT') }}</el-button>
            </div>
        </div>
    </div>
</template>