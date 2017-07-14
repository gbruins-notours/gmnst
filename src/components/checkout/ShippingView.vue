<template>
    <div>

        <!-- Edit view -->
        <template v-if="!showDetails">

            <!-- Shipping: First Name -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_firstName"
                              v-model="firstName"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_firstName')">
                        {{ $t('Required') }}
                    </p>
                </div>
            </div>

            <!-- Shipping: Last Name -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_lastName"
                              v-model="lastName"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_lastName')">
                        {{ $t('Required') }}
                    </p>
                </div>
            </div>

            <!-- Shipping: Street Address -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('ADDRESS LINE 1') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_streetAddress"
                              v-model="streetAddress"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_streetAddress')">
                        {{ $t('Required') }}
                    </p>
                </div>
            </div>

            <!-- Shipping: Extended Address -->
            <!-- This value may be returned by the paypal response, so only displaying it if it does -->
            <div class="displayTableRow" v-if="extendedAddress">
                <label class="checkout_form_label">{{ $t('ADDRESS LINE 2') }}:</label>
                <div class="checkout_form_value">
                    <el-input v-model="extendedAddress"></el-input>
                </div>
            </div>

            <!-- Shipping: City -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('CITY') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_city"
                              v-model="city"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_city')">
                        {{ $t('Required') }}
                    </p>
                </div>
            </div>

            <!-- Shipping: State -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_state"
                              v-model="state"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_state')">
                        {{ $t('Required') }}
                    </p>
                </div>
            </div>

            <!-- Shipping: Postal Code -->
            <div class="displayTableRow">
                <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_postalCode"
                              v-model="postalCode"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_postalCode')">
                        {{ $t('Required') }}
                    </p>
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
                    <el-input v-model="company"></el-input>
                </div>
            </div>

            <!-- Shipping: Email -->
            <div class="displayTableRow" v-if="showEmail">
                <label class="checkout_form_label">{{ $t('EMAIL ADDRESS') }}:</label>
                <div class="checkout_form_value">
                    <el-input name="shipping_email"
                              v-model="email"
                              v-validate="'required'"></el-input>

                    <p role="alert" v-if="errors.first('shipping_email')">
                        {{ $t('Please enter a valid email address.') }}
                    </p>
                </div>
            </div>

            <div class="ptl">
                <shipping-billing-help></shipping-billing-help>
            </div>
        </template>

        <!-- Details view -->
        <template v-else>
            <div>{{ formattedName }}</div>
            <div v-show="company">{{ company.toUpperCase() }}</div>
            <div>{{ streetAddress }}</div>
            <div v-show="extendedAddress">{{ extendedAddress }}</div>
            <div>{{ formattedCityStateZip }}</div>
            <div>{{ country }}</div>
            <div class="pts" v-if="showEmail">{{ email }}</div>
        </template>

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
        props: {
            showDetails: {
                type: Boolean,
                default: false
            },

            showEmail: {
                type: Boolean,
                default: true
            }
        },

        components: {
            ShippingBillingHelp,
            CountrySelect
        },

        computed: {
            formattedName: function() {
                return `${this.firstName} ${this.lastName}`;
            },

            formattedCityStateZip: function() {
                return `${this.city}, ${this.state} ${this.postalCode}`;
            }
        },

        data: function() {
            return {
                // firstName: null,
                // lastName: null,
                // streetAddress: null,
                // extendedAddress: null,
                // city: null,
                // state: null,
                // postalCode: null,
                // country: null,
                // company: null,
                // email: null,

                firstName: 'greg',
                lastName: 'bruins',
                streetAddress: '123 abc st',
                extendedAddress: null,
                city: 'san mateo',
                state: 'CA',
                postalCode: '12345',
                country: 'AD',
                company: 'foo company',
                email: 'greg@greg.com',
            }
        }
    }
</script>
