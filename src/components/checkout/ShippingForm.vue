<template>
    <section class="container">

        <div class="g-spec no-zebra mbl">
            <div class="g-spec-label nowrap">{{ $t('Shipping') }}</div>
            <div class="g-spec-content">
                <!-- Shipping: First Name -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="firstName" @input="$v.firstName.$touch()"></el-input>
                        <p role="alert" v-if="$v.firstName.$dirty && !$v.firstName.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: Last Name -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="lastName" @input="$v.lastName.$touch()"></el-input>
                        <p role="alert" v-if="$v.lastName.$dirty && !$v.lastName.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: Street Address -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('ADDRESS LINE 1') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="streetAddress" @input="$v.streetAddress.$touch()"></el-input>
                        <p role="alert" v-if="$v.streetAddress.$dirty && !$v.streetAddress.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: Extended Address -->
                <!-- This value may be returned by the paypal response, so only displaying it if it does -->
                <div class="displayTableRow" v-if="extendedAddress">
                    <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="extendedAddress"></el-input>
                    </div>
                </div>

                <!-- Shipping: City -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('CITY') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="city" @input="$v.city.$touch()"></el-input>
                        <p role="alert" v-if="$v.city.$dirty && !$v.city.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: State -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="state" @input="$v.state.$touch()"></el-input>
                        <p role="alert" v-if="$v.state.$dirty && !$v.state.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: Postal Code -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="postalCode" @input="$v.postalCode.$touch()"></el-input>
                        <p role="alert" v-if="$v.postalCode.$dirty && !$v.postalCode.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Shipping: Country -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
                    <div class="checkout_form_value">
                        <country-select v-model="country"
                                        :init-value="country"
                                        value-type="alpha2"
                                        v-on:change="val => { country = val }"></country-select>
                    </div>
                </div>

                <!-- Shipping: Company Name -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">
                        {{ $t('COMPANY NAME') }}&nbsp;
                        <span class="colorGrayLighter">({{ $t('optional') }})</span>:
                    </label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="company"></el-input>
                    </div>
                </div>

                <!-- Shipping: Email -->
                <div class="displayTableRow">
                    <label class="checkout_form_label">{{ $t('EMAIL ADDRESS') }}:</label>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="email" @input="delayTouch($v.email)"></el-input>
                        <div role="alert" v-if="$v.email.$dirty">
                            <p v-if="!$v.email.required">{{ $t('Required') }}</p>
                            <p v-if="!$v.email.email">{{ $t('Please enter a valid email address.') }}</p>
                        </div>
                    </div>
                </div>

                <div class="ptl">
                    <shipping-billing-help></shipping-billing-help>
                </div>

                <div class="mtl">
                    <el-button type="warning"
                                @click="submitForm"
                                :disabled="submitButtonDisabled"
                                class="colorBlack">{{ $t('Continue') }}</el-button>
                    <div v-if="submitButtonDisabled" class="colorGreen">Please fill out the form completely before continuing. Thanks!</div>
                </div>
            </div>
        </div>

    </section>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Button, Input } from 'element-ui'
    import CountrySelect from '../CountrySelect.vue'
    import ShippingBillingHelp from './ShippingBillingHelp.vue'
    import Validations from 'vuelidate'
    import { email, required } from 'vuelidate/lib/validators'

    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Validations)

    const touchMap = new WeakMap();

    export default {
        components: {
            ShippingBillingHelp,
            CountrySelect
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

            delayTouch ($v) {
                $v.$reset()
                if (touchMap.has($v)) {
                    clearTimeout(touchMap.get($v))
                }
                touchMap.set($v, setTimeout($v.$touch, 1000))
            },

            submitForm: function() {
                if(!this.submitButtonDisabled) {
                    this.$emit('shipping_form_submit')
                }
            }
        },

        validations: {
            firstName: { required },
            lastName: { required },
            streetAddress: { required },
            city: { required },
            state: { required },
            postalCode: { required },
            email: { required, email },
        }
    }
</script>


<style></style>
