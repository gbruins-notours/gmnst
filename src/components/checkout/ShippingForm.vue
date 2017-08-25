<template>
    <section class="container">
        <!-- Email -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('EMAIL ADDRESS') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.email" @input="delayTouch($v.cart.shipping.email)"></el-input>
                <div role="alert" v-if="$v.cart.shipping.email.$dirty">
                    <p v-if="!$v.cart.shipping.email.required">{{ $t('Required') }}</p>
                    <p v-if="!$v.cart.shipping.email.email">{{ $t('Please enter a valid email address.') }}</p>
                </div>
            </div>
        </div>

        <!-- Country -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COUNTRY') }}:
            </label>
            <div class="checkout_form_value">
                <country-select v-model="cart.shipping.countryCodeAlpha2"
                                :init-value="cart.shipping.countryCodeAlpha2"
                                value-type="alpha2"
                                @input="countryCodeChanged"></country-select>
                <!-- <country-select v-model="cart.shipping.countryCodeAlpha2"
                                :init-value="cart.shipping.countryCodeAlpha2"
                                value-type="alpha2"
                                @input="$v.cart.shipping.countryCodeAlpha2.$touch()"
                                v-on:change="val => { cart.shipping.countryCodeAlpha2 = val }"></country-select> -->
            </div>
        </div>

        <!-- First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('FIRST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.firstName" @input="$v.cart.shipping.firstName.$touch()"></el-input>
                <p role="alert" v-if="$v.cart.shipping.firstName.$dirty && !$v.cart.shipping.firstName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('LAST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.lastName" @input="$v.cart.shipping.lastName.$touch()"></el-input>
                <p role="alert" v-if="$v.cart.shipping.lastName.$dirty && !$v.cart.shipping.lastName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('ADDRESS LINE 1') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.streetAddress" @input="$v.cart.shipping.streetAddress.$touch()"></el-input>
                <p role="alert" v-if="$v.cart.shipping.streetAddress.$dirty && !$v.cart.shipping.streetAddress.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Extended Address -->
        <!-- This value may be returned by the paypal response, so only displaying it if it does -->
        <div class="displayTableRow" v-if="cart.shipping.extendedAddress">
            <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.extendedAddress"></el-input>
            </div>
        </div>

        <!-- City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('CITY') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.city" @input="$v.cart.shipping.city.$touch()"></el-input>
                <p role="alert" v-if="$v.cart.shipping.city.$dirty && !$v.cart.shipping.city.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('STATE/PROVINCE/REGION') }}:
            </label>
            <div class="checkout_form_value">
                <!-- <el-input v-model.trim="state" @input="$v.state.$touch()"></el-input> -->
                <state-province-select v-model.trim="cart.shipping.state"
                                       :init-value="cart.shipping.state"
                                       :country="cart.shipping.countryCodeAlpha2"
                                       @input="$v.cart.shipping.state.$touch()"
                                       v-on:change="val => { cart.shipping.state = val }"
                                       :disabled="!stateSelectEnabled"></state-province-select>
                <p role="alert" v-if="$v.cart.shipping.state.$dirty && !$v.cart.shipping.state.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('POSTAL CODE') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.postalCode" @input="$v.cart.shipping.postalCode.$touch()"></el-input>
                <p role="alert" v-if="$v.cart.shipping.postalCode.$dirty && !$v.cart.shipping.postalCode.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Company Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COMPANY NAME') }}&nbsp;
                <span class="colorGrayLighter">({{ $t('optional') }})</span>:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="cart.shipping.company"></el-input>
            </div>
        </div>

        <div class="ptl">
            <shipping-billing-help></shipping-billing-help>
        </div>

        <div class="mtl">
            <el-button type="warning"
                        @click="submitForm"
                        :disabled="submitButtonDisabled"
                        :loading="submitButtonLoading"
                        class="colorBlack">{{ $t('Continue') }}</el-button>
            <div v-if="submitButtonDisabled" class="colorGreen">{{ $t('fill_out_form_warning') }}</div>
        </div>
    </section>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button, Input, Notification } from 'element-ui'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.forEach'
    import CountrySelect from '../CountrySelect.vue'
    import StateProvinceSelect from '../StateProvinceSelect.vue'
    import ShippingBillingHelp from './ShippingBillingHelp.vue'
    import Validations from 'vuelidate'
    import { email, required } from 'vuelidate/lib/validators'
    import api from '../../util/api'

    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Validations)

    Vue.prototype.$notify = Notification;

    let currentNotification = null;
    const touchMap = new WeakMap();

    export default {
        components: {
            ShippingBillingHelp,
            CountrySelect,
            StateProvinceSelect
        },

        data: function() {
            return {
                submitButtonLoading: false,
                stateSelectEnabled: false
            }
        },

        computed: {
            ...mapGetters([
                'cart'
            ]),

            submitButtonDisabled: function() {
                return this.$v.$invalid;
            }
        },

        created: function() {
            this.stateSelectEnabled = (isObject(this.cart) && isObject(this.cart.shipping) && this.cart.shipping.countryCodeAlpha2)
        },

        methods: {
            countryCodeChanged: function(newVal) {
                this.$v.cart.shipping.countryCodeAlpha2.$touch();
                this.cart.shipping.countryCodeAlpha2 = newVal;
                this.stateSelectEnabled = newVal ? true : false;
            },

            delayTouch: function($v) {
                $v.$reset()
                if (touchMap.has($v)) {
                    clearTimeout(touchMap.get($v))
                }
                touchMap.set($v, setTimeout($v.$touch, 1000))
            },

            submitForm: function() {
                let self = this;
                let c = this.cart;

                if(currentNotification) {
                    currentNotification.close();
                }

                if(!this.submitButtonDisabled) {
                    this.submitButtonLoading = true;

                    api.shoppingCart.validateAddress({
                        company_name: c.shipping.company,
                        address_line1: c.shipping.streetAddress,
                        city_locality: c.shipping.city,
                        state_province: c.shipping.state,
                        postal_code: c.shipping.postalCode,
                        country_code: c.shipping.countryCodeAlpha2
                    })
                    .then((result) => {
                        let validation = Array.isArray(result) ? result[0] : result;

                        self.submitButtonLoading = false;

                        switch(validation.status) {
                            case 'verified':
                                c.shipping.company = validation.matched_address.company
                                c.shipping.streetAddress = validation.matched_address.address_line1
                                c.shipping.city = validation.matched_address.city_locality
                                c.shipping.state = validation.matched_address.state_province
                                c.shipping.postalCode = validation.matched_address.postal_code
                                c.shipping.countryCodeAlpha2 = validation.matched_address.country_code

                                self.$emit('shipping_form_submit')
                                return;

                            // NOTE: The 'unverified' case could still be a correct address.
                            // This will most likely happen if the country value
                            // is not supported (https://docs.shipengine.com/docs/address-validation).
                            // In this case we should consider 'unverified' as valid so the transaction can continue.
                            //
                            // ALSO NOTE: The 'matched_address' property is null when the status is 'unverified',
                            // so we need to get the values from the 'original_address' property
                            case 'unverified':
                                c.shipping.company = validation.original_address.company
                                c.shipping.streetAddress = validation.original_address.address_line1
                                c.shipping.city = validation.original_address.city_locality
                                c.shipping.state = validation.original_address.state_province
                                c.shipping.postalCode = validation.original_address.postal_code
                                c.shipping.countryCodeAlpha2 = validation.original_address.country_code

                                self.$emit('shipping_form_submit')
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

                        this.$notify({
                            title: msg || "An internal server error occurred",
                            // message: errorMessage,
                            duration: 0,
                            type: 'error'
                        });
                    });
                }
            }
        },

        validations: {
            cart: {
                shipping: {
                    email: { required, email },
                    countryCodeAlpha2: { required },
                    firstName: { required },
                    lastName: { required },
                    streetAddress: { required },
                    city: { required },
                    state: { required },
                    postalCode: { required }
                }
            },
            // For some reason having another property on this 'validations'
            // object enables the object nesting above to work.  Probably
            // a bug in the library
            foo: {}
        }
    }
</script>


<style>
</style>
