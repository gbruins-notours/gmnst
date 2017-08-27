<template>
    <section class="container">
        <!-- Email -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('EMAIL ADDRESS') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.email" 
                          @input="onInputChange('email')"
                          @blur="onInputBlur('email')"
                          :class="{ 'inputError': $v.shipping.email.$error }"></el-input>
                <div role="alert" v-show="canShowValidationMsg('email')">
                    <p v-if="!$v.shipping.email.required">{{ $t('Required') }}</p>
                    <p v-if="!$v.shipping.email.email">{{ $t('Please enter a valid email address.') }}</p>
                </div>
            </div>
            <i v-show="canShowGreenCheck('email')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Country -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COUNTRY') }}:
            </label>
            <div class="checkout_form_value">
                <country-select v-model="shipping.countryCodeAlpha2"
                                :init-value="shipping.countryCodeAlpha2"
                                value-type="alpha2"
                                @change="countryCodeChanged"></country-select>
                <p role="alert" v-show="canShowValidationMsg('countryCodeAlpha2')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('countryCodeAlpha2')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('FIRST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.firstName" 
                          @input="onInputChange('firstName')"
                          @blur="onInputBlur('firstName')"
                          :class="{ 'inputError': $v.shipping.firstName.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('firstName')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('firstName')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('LAST NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.lastName" 
                          @input="onInputChange('lastName')"
                          @blur="onInputBlur('lastName')"
                          :class="{ 'inputError': $v.shipping.lastName.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('lastName')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('lastName')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('ADDRESS LINE 1') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.streetAddress" 
                          @input="onInputChange('streetAddress')"
                          @blur="onInputBlur('streetAddress')"
                          :class="{ 'inputError': $v.shipping.streetAddress.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('streetAddress')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('streetAddress')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Extended Address -->
        <!-- This value may be returned by the paypal response, so only displaying it if it does -->
        <div class="displayTableRow" v-if="shipping.extendedAddress">
            <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.extendedAddress"></el-input>
            </div>
        </div>

        <!-- City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('CITY') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.city" 
                          @input="onInputChange('city')"
                          @blur="onInputBlur('city')"
                          :class="{ 'inputError': $v.shipping.city.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('city')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('city')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('STATE/PROVINCE/REGION') }}:
            </label>
            <div class="checkout_form_value">
                <state-province-select v-model.trim="shipping.state"
                                       :init-value="shipping.state"
                                       :country="shipping.countryCodeAlpha2"
                                       @change="stateChanged"
                                       :disabled="!stateSelectEnabled"
                                       :class="{ 'inputError': $v.shipping.state.$error }"></state-province-select>
                <p role="alert" v-show="canShowValidationMsg('state')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('state')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('POSTAL CODE') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.postalCode" 
                          @input="onInputChange('postalCode')"
                          @blur="onInputBlur('postalCode')"
                         :class="{ 'inputError': $v.shipping.postalCode.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('postalCode')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('postalCode')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Company Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COMPANY NAME') }}:
            </label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping.company"
                          :placeholder="'(' + $t('optional') + ')'"
                          @input="onInputChange('company')"
                          @blur="onInputBlur('company')"></el-input>
            </div>
            <i v-show="canShowGreenCheck('company')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <div class="ptl">
            <shipping-billing-help></shipping-billing-help>
        </div>

        <div class="mtl tac">
            <el-button type="warning"
                        size="large"
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
                stateSelectEnabled: false,

                shipping: {
                    email: this.$store.state.cart.shipping.email,
                    countryCodeAlpha2: this.$store.state.cart.shipping.countryCodeAlpha2,
                    firstName: this.$store.state.cart.shipping.firstName,
                    lastName: this.$store.state.cart.shipping.lastName,
                    streetAddress: this.$store.state.cart.shipping.streetAddress,
                    extendedAddress: this.$store.state.cart.shipping.extendedAddress,
                    city: this.$store.state.cart.shipping.city,
                    state: this.$store.state.cart.shipping.state,
                    postalCode: this.$store.state.cart.shipping.postalCode,
                    company: this.$store.state.cart.shipping.company,
                },
                greenChecks: {
                    email: false,
                    countryCodeAlpha2: false,
                    firstName: false,
                    lastName: false,
                    streetAddress: false,
                    extendedAddress: false,
                    city: false,
                    state: false,
                    postalCode: false,
                    company: false, 
                }
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
            onSelectVisibleChange(attr, isOpen) {
                if(!isOpen) {
                    // determine whether or not to display the green check when 
                    // the select menu is closed
                    this.$v.shipping[attr].$touch();
                    this.onInputBlur(attr);
                }
            },

            onInputChange(attr) {
                switch(attr) {
                    case 'email':
                        this.delayTouch(this.$v.shipping.email, 1000);
                        break;

                    default:
                        this.$v.shipping[attr].$touch();
                }

                // If the input value ever goes invalid then remove the green check
                if(this.$v.shipping[attr].$invalid) {
                    this.greenChecks[attr] = false;
                }
            },

            onInputBlur(attr) {
                // If the user types quickly, the onInputChange event may still be in progress
                // because there is a 1 second timeout for email.  Therefore we call it again
                // so that the old instance stops and the new one fires immediately.  Then we 
                // can procede as normal.
                if(attr === 'email') {
                   this.delayTouch(this.$v.shipping.email, 0); 
                }
                this.greenChecks[attr] = this.$v.shipping[attr].$dirty && !this.$v.shipping[attr].$invalid;
            },

            /**
             * Determine if the green checkmark should be displayed
             */
            canShowGreenCheck(attr) {
                return this.greenChecks[attr] && !this.$v.shipping[attr].$error;
            },

            /**
             * Determine if the validation error message should be displayed
             */
            canShowValidationMsg(attr) {
                switch(attr) {
                    case 'email':
                        return this.$v.shipping.email.$dirty

                    default:
                        return this.$v.shipping[attr].$dirty && !this.$v.shipping[attr].required

                }
            },

            countryCodeChanged: function(newVal) {
                this.shipping.countryCodeAlpha2 = newVal;
                this.stateSelectEnabled = newVal ? true : false;
                this.onInputChange('countryCodeAlpha2');
                this.onInputBlur('countryCodeAlpha2');
            },

            stateChanged: function(newVal) {
                this.shipping.state = newVal;
                this.onInputChange('state');
                this.onInputBlur('state');
            },

            delayTouch: function($v, timeout) {
                $v.$reset()
                if (touchMap.has($v)) {
                    clearTimeout(touchMap.get($v))
                }

                if(timeout) {
                    touchMap.set($v, setTimeout($v.$touch, timeout || 1000))
                }
                else {
                   $v.$touch(); 
                }
            },

            /**
             * Validates the shipping address
             */
            submitForm: function() {
                let self = this;
                let c = this.$store.state.cart.shipping;

                if(currentNotification) {
                    currentNotification.close();
                }

                if(!this.submitButtonDisabled) {
                    this.submitButtonLoading = true;

                    // Updating the state sttributes that won't be updated below
                    c.email = this.shipping.email;
                    c.firstName = this.shipping.firstName;
                    c.lastName = this.shipping.lastName;
                    c.extendedAddress = this.shipping.extendedAddress;
                    c.company = this.shipping.company;

                    api.shoppingCart.validateAddress({
                        company_name: this.shipping.company,
                        address_line1: this.shipping.streetAddress,
                        city_locality: this.shipping.city,
                        state_province: this.shipping.state,
                        postal_code: this.shipping.postalCode,
                        country_code: this.shipping.countryCodeAlpha2
                    })
                    .then((result) => {
                        let validation = Array.isArray(result) ? result[0] : result;

                        self.submitButtonLoading = false;

                        // Add the validated values to the state
                        switch(validation.status) {
                            case 'verified':
                                c.company = validation.matched_address.company
                                c.streetAddress = validation.matched_address.address_line1
                                c.city = validation.matched_address.city_locality
                                c.state = validation.matched_address.state_province
                                c.postalCode = validation.matched_address.postal_code
                                c.countryCodeAlpha2 = validation.matched_address.country_code

                                console.log("VERIFIED!", c);

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
                                c.company = validation.original_address.company
                                c.streetAddress = validation.original_address.address_line1
                                c.city = validation.original_address.city_locality
                                c.state = validation.original_address.state_province
                                c.postalCode = validation.original_address.postal_code
                                c.countryCodeAlpha2 = validation.original_address.country_code

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
            shipping: {
                email: { required, email },
                countryCodeAlpha2: { required },
                firstName: { required },
                lastName: { required },
                streetAddress: { required },
                city: { required },
                state: { required },
                postalCode: { required },
                company: {} // no validation needed
            }
        }
    }
</script>


<style lang="scss">
    @import "../../assets/css/components/_variables.scss";

    .inputError input,
    .inputError select {
        border-color: $colorRed !important
    }
</style>
