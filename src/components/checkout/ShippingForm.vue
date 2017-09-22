<template>
    <section class="container">
        <!-- Email -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('EMAIL ADDRESS') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_email" 
                          @input="onInputChange('shipping_email')"
                          @blur="onInputBlur('shipping_email')"
                          :class="{ 'inputError': $v.shipping_email.$error }"></el-input>
                <div role="alert" v-show="canShowValidationMsg('shipping_email')">
                    <p v-if="!$v.shipping_email.required">{{ $t('Required') }}</p>
                    <p v-if="!$v.shipping_email.email">{{ $t('Please enter a valid email address.') }}</p>
                </div>
            </div>
            <i v-show="canShowGreenCheck('shipping_email')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Country -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
            <div class="checkout_form_value">
                <country-select v-model="shipping_countryCodeAlpha2"
                                :init-value="shipping_countryCodeAlpha2"
                                value-type="alpha2"
                                @change="countryCodeChanged"></country-select>
                <p role="alert" v-show="canShowValidationMsg('shipping_countryCodeAlpha2')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_countryCodeAlpha2')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_firstName" 
                          @input="onInputChange('shipping_firstName')"
                          @blur="onInputBlur('shipping_firstName')"
                          :class="{ 'inputError': $v.shipping_firstName.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('shipping_firstName')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_firstName')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_lastName" 
                          @input="onInputChange('shipping_lastName')"
                          @blur="onInputBlur('shipping_lastName')"
                          :class="{ 'inputError': $v.shipping_lastName.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('shipping_lastName')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_lastName')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('ADDRESS LINE 1') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_streetAddress" 
                          @input="onInputChange('shipping_streetAddress')"
                          @blur="onInputBlur('shipping_streetAddress')"
                          :class="{ 'inputError': $v.shipping_streetAddress.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('shipping_streetAddress')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_streetAddress')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Extended Address -->
        <!-- This value may be returned by the paypal response, so only displaying it if it does -->
        <div class="displayTableRow" v-if="shipping_extendedAddress">
            <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_extendedAddress"></el-input>
            </div>
        </div>

        <!-- City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('CITY') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_city" 
                          @input="onInputChange('shipping_city')"
                          @blur="onInputBlur('shipping_city')"
                          :class="{ 'inputError': $v.shipping_city.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('shipping_city')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_city')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
            <div class="checkout_form_value">
                <state-province-select v-model.trim="shipping_state"
                                       :init-value="shipping_state"
                                       :country="shipping_countryCodeAlpha2"
                                       @change="stateChanged"
                                       :disabled="!stateSelectEnabled"
                                       :class="{ 'inputError': $v.shipping_state.$error }"></state-province-select>
                <p role="alert" v-show="canShowValidationMsg('shipping_state')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_state')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_postalCode" 
                          @input="onInputChange('shipping_postalCode')"
                          @blur="onInputBlur('shipping_postalCode')"
                         :class="{ 'inputError': $v.shipping_postalCode.$error }"></el-input>
                <p role="alert" v-show="canShowValidationMsg('shipping_postalCode')">{{ $t('Required') }}</p>
            </div>
            <i v-show="canShowGreenCheck('shipping_postalCode')" 
               class="displayTableCell plm el-icon-circle-check colorGreen vam"></i>
        </div>

        <!-- Company Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('COMPANY NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model.trim="shipping_company"
                          :placeholder="'(' + $t('optional') + ')'"
                          @input="onInputChange('shipping_company')"
                          @blur="onInputBlur('shipping_company')"></el-input>
            </div>
            <i v-show="canShowGreenCheck('shipping_company')" 
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
    import forEach from 'lodash.foreach'
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

                shipping_email: this.$store.state.cart.shipping_email,
                shipping_countryCodeAlpha2: this.$store.state.cart.shipping_countryCodeAlpha2,
                shipping_firstName: this.$store.state.cart.shipping_firstName,
                shipping_lastName: this.$store.state.cart.shipping_lastName,
                shipping_streetAddress: this.$store.state.cart.shipping_streetAddress,
                shipping_extendedAddress: this.$store.state.cart.shipping_extendedAddress,
                shipping_city: this.$store.state.cart.shipping_city,
                shipping_state: this.$store.state.cart.shipping_state,
                shipping_postalCode: this.$store.state.cart.shipping_postalCode,
                shipping_company: this.$store.state.cart.shipping_company,

                greenChecks: {
                    shipping_email: false,
                    shipping_countryCodeAlpha2: false,
                    shipping_firstName: false,
                    shipping_lastName: false,
                    shipping_streetAddress: false,
                    shipping_extendedAddress: false,
                    shipping_city: false,
                    shipping_state: false,
                    shipping_postalCode: false,
                    shipping_company: false, 
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
            this.stateSelectEnabled = (isObject(this.cart) && this.cart.shipping_countryCodeAlpha2)
        },

        methods: {
            onSelectVisibleChange(attr, isOpen) {
                if(!isOpen) {
                    // determine whether or not to display the green check when 
                    // the select menu is closed
                    this.$v[attr].$touch();
                    this.onInputBlur(attr);
                }
            },

            onInputChange(attr) {
                switch(attr) {
                    case 'shipping_email':
                        this.delayTouch(this.$v.shipping_email, 1000);
                        break;

                    default:
                        this.$v[attr].$touch();
                }

                // If the input value ever goes invalid then remove the green check
                if(this.$v[attr].$invalid) {
                    this.greenChecks[attr] = false;
                }
            },

            onInputBlur(attr) {
                // If the user types quickly, the onInputChange event may still be in progress
                // because there is a 1 second timeout for email.  Therefore we call it again
                // so that the old instance stops and the new one fires immediately.  Then we 
                // can procede as normal.
                if(attr === 'shipping_email') {
                   this.delayTouch(this.$v.shipping_email, 0); 
                }
                this.greenChecks[attr] = this.$v[attr].$dirty && !this.$v[attr].$invalid;
            },

            /**
             * Determine if the green checkmark should be displayed
             */
            canShowGreenCheck(attr) {
                return this.greenChecks[attr] && !this.$v[attr].$error;
            },

            /**
             * Determine if the validation error message should be displayed
             */
            canShowValidationMsg(attr) {
                switch(attr) {
                    case 'shipping_email':
                        return this.$v[attr].$dirty

                    default:
                        return this.$v[attr].$dirty && !this.$v[attr].required

                }
            },

            countryCodeChanged: function(newVal) {
                this.shipping_countryCodeAlpha2 = newVal;
                this.stateSelectEnabled = newVal ? true : false;
                this.onInputChange('shipping_countryCodeAlpha2');
                this.onInputBlur('shipping_countryCodeAlpha2');
            },

            stateChanged: function(newVal) {
                this.shipping_state = newVal;
                this.onInputChange('shipping_state');
                this.onInputBlur('shipping_state');
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
                let c = this.$store.state.cart;

                if(currentNotification) {
                    currentNotification.close();
                }

                if(!this.submitButtonDisabled) {
                    this.submitButtonLoading = true;

                    // Updating the state sttributes that won't be updated below
                    c.shipping_email = this.shipping_email;
                    c.shipping_firstName = this.shipping_firstName;
                    c.shipping_lastName = this.shipping_lastName;
                    c.shipping_extendedAddress = this.shipping_extendedAddress;
                    c.shipping_company = this.shipping_company;

                    api.shoppingCart.validateAddress({
                        company_name: this.shipping_company,
                        address_line1: this.shipping_streetAddress,
                        city_locality: this.shipping_city,
                        state_province: this.shipping_state,
                        postal_code: this.shipping_postalCode,
                        country_code: this.shipping_countryCodeAlpha2
                    })
                    .then((result) => {
                        let validation = Array.isArray(result) ? result[0] : result;

                        self.submitButtonLoading = false;

                        // Add the validated values to the state
                        switch(validation.status) {
                            case 'verified':
                                c.shipping_company = validation.matched_address.company
                                c.shipping_streetAddress = validation.matched_address.address_line1
                                c.shipping_city = validation.matched_address.city_locality
                                c.shipping_state = validation.matched_address.state_province
                                c.shipping_postalCode = validation.matched_address.postal_code
                                c.shipping_countryCodeAlpha2 = validation.matched_address.country_code

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
                                c.shipping_company = validation.original_address.company
                                c.shipping_streetAddress = validation.original_address.address_line1
                                c.shipping_city = validation.original_address.city_locality
                                c.shipping_state = validation.original_address.state_province
                                c.shipping_postalCode = validation.original_address.postal_code
                                c.shipping_countryCodeAlpha2 = validation.original_address.country_code

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
            shipping_email: { required, email },
            shipping_countryCodeAlpha2: { required },
            shipping_firstName: { required },
            shipping_lastName: { required },
            shipping_streetAddress: { required },
            shipping_city: { required },
            shipping_state: { required },
            shipping_postalCode: { required },
            shipping_company: {} // no validation needed
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
