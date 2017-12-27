<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.foreach'
    import { Notification, Loading, Dialog, Select, Button } from 'element-ui'
    import ShippingBillingForm from '@/components/checkout/ShippingBillingForm'
    import ShippingBillingHelp from '@/components/checkout/ShippingBillingHelp'
    import ShoppingCartService from '@/pages/cart/shopping_cart_service.js'
    import BottomPopover from '@/components/BottomPopover'
    import PageHeader from '@/components/PageHeader'

    Vue.prototype.$notify = Notification;
    Vue.use(Button)
    Vue.use(Loading.directive)

    let currentNotification = null;
    let shoppingCartService = new ShoppingCartService();

    export default {
        components: {
            ShippingBillingForm,
            ShippingBillingHelp,
            BottomPopover,
            PageHeader
        },

        computed: {
            ...mapGetters([
                'cart',
                'cartShippingAttributes'
            ]),
        },

        data: function() {
            return {
                shippingButtonEnabled: false,
                shippingFormIsLoading: false
            }
        },

        methods: {
            updateShippingStateFromValidation: function(obj) {
                let c = this.cart;

                c.shipping_company = obj.company_name
                c.shipping_streetAddress = obj.address_line1
                c.shipping_city = obj.city_locality
                c.shipping_state = obj.state_province
                c.shipping_postalCode = obj.postal_code
                c.shipping_countryCodeAlpha2 = obj.country_code
            },

            shippingFormDone: function() {
                delete this.cartShippingAttributes.shipping_total;
                delete this.cartShippingAttributes.shipping_rate;

                // This step needs to clear the shipping rate cache because
                // we are assuming the shipping address has changed and thus
                // new rates should be retrieved
                this.$store.dispatch('CART_CLEAR_SHIPPING_RATES_CACHE');

                // Setting the shipping address will also calculate the
                // sales tax for the cart because sales tax calculation requires
                // knowledge of the destination.  Sales tax needs to be set so
                // the API can return the shipping/tax/grand total amounts for the 'review'
                // checkout step
                return shoppingCartService
                    .setShippingAddress(this.cartShippingAttributes)
                    .then((result) => {
                        // As a convenience to the user keeping the Country and State
                        // values the same as the shipping values, as they are likely the same
                        if(!result.billing_countryCodeAlpha2) {
                            result.billing_countryCodeAlpha2 = result.shipping_countryCodeAlpha2

                            if(!result.billing_state) {
                                result.billing_state = result.shipping_state
                            }
                        }

                        return this.$store.dispatch('CART_SET', result);
                    })
                    .then(() => {
                        this.$emit('done', 'shipping-address-step')
                    })
                    .catch((result) => {
                        currentNotification = this.$notify({
                            title: this.$t('An error occurred'),
                            message: 'A server error occurred while setting the shipping address.',
                            duration: 0,
                            type: 'error'
                        });
                    });
            },

            submitShippingForm: function() {
                let self = this;
                let c = this.cart;

                this.shippingFormIsLoading = true;

                if(currentNotification) {
                    currentNotification.close();
                }

                shoppingCartService.validateAddress({
                    company_name: c.shipping_company,
                    address_line1: c.shipping_streetAddress,
                    city_locality: c.shipping_city,
                    state_province: c.shipping_state,
                    postal_code: c.shipping_postalCode,
                    country_code: c.shipping_countryCodeAlpha2
                })
                .then((result) => {
                    let validation = Array.isArray(result) ? result[0] : result;

                    // Add the validated values to the state
                    switch(validation.status) {
                        case 'verified':
                            this.updateShippingStateFromValidation(validation.matched_address);
                            this.shippingFormDone().then(() => {
                                this.shippingFormIsLoading = false;
                            });
                            return;

                        // NOTE: The 'unverified' case could still be a correct address.
                        // This will most likely happen if the country value
                        // is not supported (https://docs.shipengine.com/docs/address-validation).
                        // In this case we should consider 'unverified' as valid so the transaction can continue.
                        //
                        // ALSO NOTE: The 'matched_address' property is null when the status is 'unverified',
                        // so we need to get the values from the 'original_address' property
                        case 'unverified':
                            this.updateShippingStateFromValidation(validation.original_address);
                            this.shippingFormDone().then(() => {
                                this.shippingFormIsLoading = false;
                            });
                            return;

                        default:
                            let message = this.$t('The address you provided does not seem to be a valid mailing adddress.');

                            if(isObject(validation) && Array.isArray(validation.messages)) {
                                let messages = [];

                                // Skipping message code 'a1003', because it seems kind of useless.  It's message is
                                // "Some fields were modified while verifying the address.".  That will just confuse the user,
                                // so it's probably better to display the default message in this case.
                                let skipCodes = ['a1003'];

                                forEach(validation.messages, (msg) => {
                                    if(skipCodes.indexOf(msg.code) < 0) {
                                        messages.push(msg.message)
                                    }
                                });
                                message = messages.join('\n\n');
                            }

                            this.shippingFormIsLoading = false;

                            currentNotification = this.$notify({
                                title: this.$t('Address validation error'),
                                message: message,
                                duration: 0,
                                type: 'error'
                            });
                            break;
                    }
                })
                .catch((error) => {
                    let msg = error.message;

                    if (error.response) {
                        msg = error.response.data.message;
                    }

                    this.shippingFormIsLoading = false;

                    this.$notify({
                        title: msg || "An internal server error occurred",
                        // message: errorMessage,
                        duration: 0,
                        type: 'error'
                    });
                });
            }

        }
    }
</script>

<template>
    <div>
        <page-header :title="$t('Shipping address') + ':'"></page-header>

        <div v-loading="shippingFormIsLoading" class="mtm">
            <shipping-billing-form type="shipping" @valid="val => { shippingButtonEnabled = val }"></shipping-billing-form>

            <div class="ptl displayTable" style="margin:0 auto">
                <shipping-billing-help></shipping-billing-help>
            </div>
        </div>

        <div class="ptl tac">
            <div class="inlineBlock">
                <el-button type="warning"
                            class="colorBlack"
                            size="large"
                            @click="submitShippingForm"
                            :disabled="!shippingButtonEnabled"
                            :loading="shippingFormIsLoading">{{ $t('CONTINUE TO SHIPPING METHOD') }}</el-button>

                <bottom-popover width="200px"
                                v-show="!shippingButtonEnabled" >{{ $t('fill_out_form_warning') }}</bottom-popover>
            </div>
        </div>
    </div>
</template>