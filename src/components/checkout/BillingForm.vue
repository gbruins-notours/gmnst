<template>
    <div>

        <!-- Billing: First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="firstName" @input="$v.firstName.$touch()"></el-input>
                <p role="alert" v-if="$v.firstName.$dirty && !$v.firstName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="lastName" @input="$v.lastName.$touch()"></el-input>
                <p role="alert" v-if="$v.lastName.$dirty && !$v.lastName.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('STREET ADDRESS') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="streetAddress" @input="$v.streetAddress.$touch()"></el-input>
                <p role="alert" v-if="$v.streetAddress.$dirty && !$v.streetAddress.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('CITY') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="city" @input="$v.city.$touch()"></el-input>
                <p role="alert" v-if="$v.city.$dirty && !$v.city.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="state" @input="$v.state.$touch()"></el-input>
                <p role="alert" v-if="$v.state.$dirty && !$v.state.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
            <div class="checkout_form_value">
                <el-input v-model="postalCode" @input="$v.postalCode.$touch()"></el-input>
                <p role="alert" v-if="$v.postalCode.$dirty && !$v.postalCode.required">{{ $t('Required') }}</p>
            </div>
        </div>

        <!-- Billing: Country -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
            <div class="checkout_form_value">
                <country-select v-model="country"
                                :init-value="country"
                                value-type="alpha2"
                                v-on:change="val => { country = val }"></country-select>
            </div>
        </div>

        <!-- Billing: Company Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">
                {{ $t('COMPANY NAME') }}&nbsp;
                <span class="colorGrayLighter">({{ $t('optional') }})</span>:
            </label>
            <div class="checkout_form_value">
                <el-input v-model="company"></el-input>
            </div>
        </div>

        <div class="ptl">
            <shipping-billing-help></shipping-billing-help>
        </div>

    </div>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Input } from 'element-ui'
    import CountrySelect from '../CountrySelect.vue'
    import ShippingBillingHelp from './ShippingBillingHelp.vue'
    import Validations from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'

    Vue.use(Input)
    Vue.use(Validations)

    export default{
        components: {
            ShippingBillingHelp,
            CountrySelect
        },

        computed: {
            firstName: {
                get: function() {
                    return this.getBillingAttribute('firstName');
                },
                set: function(newVal) {
                    this.setBillingAttribute('firstName', newVal)
                }
            },
            lastName: {
                get: function() {
                    return this.getBillingAttribute('lastName');
                },
                set: function(newVal) {
                    this.setBillingAttribute('lastName', newVal)
                }
            },
            streetAddress: {
                get: function() {
                    return this.getBillingAttribute('streetAddress');
                },
                set: function(newVal) {
                    this.setBillingAttribute('streetAddress', newVal)
                }
            },
            city: {
                get: function() {
                    return this.getBillingAttribute('city');
                },
                set: function(newVal) {
                    this.setBillingAttribute('city', newVal)
                }
            },
            state: {
                get: function() {
                    return this.getBillingAttribute('state');
                },
                set: function(newVal) {
                    this.setBillingAttribute('state', newVal)
                }
            },
            postalCode: {
                get: function() {
                    return this.getBillingAttribute('postalCode');
                },
                set: function(newVal) {
                    this.setBillingAttribute('postalCode', newVal)
                }
            },
            country: {
                get: function() {
                    return this.getBillingAttribute('country');
                },
                set: function(newVal) {
                    this.setBillingAttribute('country', newVal)
                }
            },
            company: {
                get: function() {
                    return this.getBillingAttribute('company');
                },
                set: function(newVal) {
                    this.setBillingAttribute('company', newVal)
                }
            }
        },

        methods: {
            setBillingAttribute: function(attribute, value) {
                this.$store.dispatch('CHECKOUT_BILLING_ATTRIBUTE', {
                    attribute,
                    value
                });
            },
            getBillingAttribute: function(attribute) {
                return this.$store.state.checkout.billing[attribute];
            }
        }
    }
</script>
