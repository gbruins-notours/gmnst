<template>
    <section class="container">
        <!-- Email -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('EMAIL ADDRESS') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="email" @input="delayTouch($v.email)"></el-input>
                <div role="alert" v-if="$v.email.$dirty">
                    <p v-if="!$v.email.required">{{ $t('Required') }}</p>
                    <p v-if="!$v.email.email">{{ $t('Please enter a valid email address.') }}</p>
                </div>
            </div>
        </div>

        <!-- Country -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COUNTRY') }}:
            </label>
            <div class="checkout_form_value">
                <country-select v-model="country"
                                :init-value="country"
                                value-type="alpha2"
                                @input="$v.country.$touch()"
                                v-on:change="val => { country = val }"></country-select>
            </div>
        </div>

        <!-- First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('FIRST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="firstName" @input="$v.firstName.$touch()"></el-input>
                <p role="alert" v-if="$v.firstName.$dirty && !$v.firstName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('LAST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="lastName" @input="$v.lastName.$touch()"></el-input>
                <p role="alert" v-if="$v.lastName.$dirty && !$v.lastName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('ADDRESS LINE 1') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="streetAddress" @input="$v.streetAddress.$touch()"></el-input>
                <p role="alert" v-if="$v.streetAddress.$dirty && !$v.streetAddress.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Extended Address -->
        <!-- This value may be returned by the paypal response, so only displaying it if it does -->
        <div class="displayTableRow" v-if="extendedAddress">
            <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="extendedAddress"></el-input>
            </div>
        </div>

        <!-- City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('CITY') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="city" @input="$v.city.$touch()"></el-input>
                <p role="alert" v-if="$v.city.$dirty && !$v.city.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('STATE/PROVINCE/REGION') }}:
            </label>
            <div class="checkout_form_value">
                <!-- <el-input v-model.trim="state" @input="$v.state.$touch()"></el-input> -->
                <state-province-select v-model.trim="state"
                                       :init-value="state"
                                       :country="country"
                                       @input="$v.state.$touch()"
                                       v-on:change="val => { state = val }"></state-province-select>
                <p role="alert" v-if="$v.state.$dirty && !$v.state.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('POSTAL CODE') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="postalCode" @input="$v.postalCode.$touch()"></el-input>
                <p role="alert" v-if="$v.postalCode.$dirty && !$v.postalCode.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Company Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COMPANY NAME') }}&nbsp;
                <span class="colorGrayLighter">({{ $t('optional') }})</span>:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="company"></el-input>
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
            <div v-if="submitButtonDisabled" class="colorGreen">Please fill out the form completely before continuing. Thanks!</div>
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

        // render: function (createElement) {
        //     console.log("RENDER");
        //     h = createElement;
        // },

        data: function() {
            return {
                submitButtonLoading: false,
            }
        },

        computed: {
            submitButtonDisabled: function() {
                return this.$v.$invalid;
            },

            firstName: {
                get: function() {
                    return this.getShippingAttribute('firstName');
                },
                set: function(newVal) {
                    this.setShippingAttribute('firstName', newVal)
                }
            },
            lastName: {
                get: function() {
                    return this.getShippingAttribute('lastName');
                },
                set: function(newVal) {
                    this.setShippingAttribute('lastName', newVal)
                }
            },
            streetAddress: {
                get: function() {
                    return this.getShippingAttribute('streetAddress');
                },
                set: function(newVal) {
                    this.setShippingAttribute('streetAddress', newVal)
                }
            },
            extendedAddress: {
                get: function() {
                    return this.getShippingAttribute('extendedAddress');
                },
                set: function(newVal) {
                    this.setShippingAttribute('extendedAddress', newVal)
                }
            },
            city: {
                get: function() {
                    return this.getShippingAttribute('city');
                },
                set: function(newVal) {
                    this.setShippingAttribute('city', newVal)
                }
            },
            state: {
                get: function() {
                    return this.getShippingAttribute('state');
                },
                set: function(newVal) {
                    this.setShippingAttribute('state', newVal)
                }
            },
            postalCode: {
                get: function() {
                    return this.getShippingAttribute('postalCode');
                },
                set: function(newVal) {
                    this.setShippingAttribute('postalCode', newVal)
                }
            },
            country: {
                get: function() {
                    return this.getShippingAttribute('countryCodeAlpha2');
                },
                set: function(newVal) {
                    this.setShippingAttribute('countryCodeAlpha2', newVal)
                }
            },
            company: {
                get: function() {
                    return this.getShippingAttribute('company');
                },
                set: function(newVal) {
                    this.setShippingAttribute('company', newVal)
                }
            },
            email: {
                get: function() {
                    return this.getShippingAttribute('email');
                },
                set: function(newVal) {
                    this.setShippingAttribute('email', newVal)
                }
            },
        },

        methods: {
            setShippingAttribute: function(attribute, value) {
                this.$store.dispatch('CHECKOUT_SHIPPING_ATTRIBUTE', {
                    attribute,
                    value
                });
            },

            getShippingAttribute: function(attribute) {
                return this.$store.state.checkout.shipping[attribute];
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

                if(currentNotification) {
                    currentNotification.close();
                }

                if(!this.submitButtonDisabled) {
                    this.submitButtonLoading = true;

                    api.shoppingCart.validateAddress({
                        company_name: this.company,
                        address_line1: this.streetAddress,
                        city_locality: this.city,
                        state_province: this.state,
                        postal_code: this.postalCode,
                        country_code: this.country
                    })
                    .then((result) => {
                        let validation = Array.isArray(result) ? result[0] : result;

                        self.submitButtonLoading = false;

                        switch(validation.status) {
                            case 'verified':
                                self.company = validation.matched_address.company
                                self.streetAddress = validation.matched_address.address_line1
                                self.city = validation.matched_address.city_locality
                                self.state = validation.matched_address.state_province
                                self.postalCode = validation.matched_address.postal_code
                                self.country = validation.matched_address.country_code

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
                                self.company = validation.original_address.company
                                self.streetAddress = validation.original_address.address_line1
                                self.city = validation.original_address.city_locality
                                self.state = validation.original_address.state_province
                                self.postalCode = validation.original_address.postal_code
                                self.country = validation.original_address.country_code

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

                        console.log("CATCH", error.response);
                        console.log("CATCH MSG", msg);

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
            email: { required, email },
            country: { required },
            firstName: { required },
            lastName: { required },
            streetAddress: { required },
            city: { required },
            state: { required },
            postalCode: { required }

            //testing only
            // email: {  },
            // country: {  },
            // firstName: {  },
            // lastName: {  },
            // streetAddress: {  },
            // city: {  },
            // state: {  },
            // postalCode: {  }
        }
    }
</script>


<style>
</style>
