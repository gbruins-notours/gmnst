<template>
    <div>

        <!-- Billing: First Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_firstName"
                          v-model="firstName"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_firstName')">
                    {{ $t('Required') }}
                </p>
            </div>
        </div>

        <!-- Billing: Last Name -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_lastName"
                          v-model="lastName"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_lastName')">
                    {{ $t('Required') }}
                </p>
            </div>
        </div>

        <!-- Billing: Street Address -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('STREET ADDRESS') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_streetAddress"
                          v-model="streetAddress"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_streetAddress')">
                    {{ $t('Required') }}
                </p>
            </div>
        </div>

        <!-- Billing: City -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('CITY') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_city"
                          v-model="city"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_city')">
                    {{ $t('Required') }}
                </p>
            </div>
        </div>

        <!-- Billing: State -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_state"
                          v-model="state"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_state')">
                    {{ $t('Required') }}
                </p>
            </div>
        </div>

        <!-- Billing: Postal Code -->
        <div class="displayTableRow">
            <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
            <div class="checkout_form_value">
                <el-input name="billing_postalCode"
                          v-model="postalCode"
                          v-validate="'required'"></el-input>
                <p role="alert" v-if="errors.first('billing_postalCode')">
                    {{ $t('Required') }}
                </p>
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
    import CountrySelect from '../../components/CountrySelect.vue'
    import ShippingBillingHelp from '../../components/checkout/ShippingBillingHelp.vue'
    import VeeValidate from 'vee-validate'

    Vue.use(Input)
    Vue.use(VeeValidate)

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
