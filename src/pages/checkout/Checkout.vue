<template>
    <section>
        <div class="container">

            <div class="columns pam">
                <div class="column is-8">
                    <div class="title">{{ $t('Checkout') }}</div>
                </div>
            </div>

            <div v-if="!this.cart.num_items" class="fs16">
                {{ $t('Your shopping cart does not contain any items.') }}
            </div>

            <template v-else>
                <div class="widthAll">
                    <!-- Shipping -->
                    <div class="g-spec mbl">
                        <div class="g-spec-label nowrap">1) {{ $t('Shipping') }}</div>
                        <div class="g-spec-content">

                            <!-- Shipping: First Name -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('FIRST NAME') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_firstName"
                                              v-model="creditCardForm.shippingAddress.firstName"
                                              v-validate="'required'"></el-input>
                                    <!--<input type="text"-->
                                           <!--name="shipping_firstName"-->
                                           <!--v-model="creditCardForm.shippingAddress.firstName"-->
                                           <!--v-validate="'required'"-->
                                           <!--class="input" />-->
                                    <p role="alert" v-if="errors.first('shipping_firstName')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: Last Name -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('LAST NAME') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_lastName"
                                              v-model="creditCardForm.shippingAddress.lastName"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_lastName')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: Street Address -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_streetAddress"
                                              v-model="creditCardForm.shippingAddress.streetAddress"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_streetAddress')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: Extended Address -->
                            <!-- This value may be returned by the paypal response, so only displaying it if it does -->
                            <div class="displayTableRow"
                                 v-if="creditCardForm.shippingAddress.extendedAddress">
                                <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS 2') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input v-model="creditCardForm.shippingAddress.extendedAddress"></el-input>
                                </div>
                            </div>

                            <!-- Shipping: City -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('CITY') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_city"
                                              v-model="creditCardForm.shippingAddress.city"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_city')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: State -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('STATE/PROVINCE') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_state"
                                              v-model="creditCardForm.shippingAddress.state"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_state')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: Postal Code -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('POSTAL CODE') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_postalCode"
                                              v-model="creditCardForm.shippingAddress.postalCode"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_postalCode')">
                                        {{ $t('Required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Shipping: Country -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('COUNTRY') }}:</label>
                                <div class="displayTableCell pbm">
                                    <country-select v-model="creditCardForm.shippingAddress.country"
                                                    :init-value="creditCardForm.shippingAddress.country"
                                                    value-type="alpha2"
                                                    v-on:change="val => { creditCardForm.shippingAddress.country = val }"></country-select>
                                </div>
                            </div>

                            <!-- Shipping: Company Name -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">
                                    {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }}):
                                </label>
                                <div class="field displayTableCell pbm">
                                    <el-input v-model="creditCardForm.shippingAddress.company"></el-input>
                                </div>
                            </div>

                            <!-- Shipping: Email -->
                            <div class="displayTableRow">
                                <label class="displayTableCell prm pbm">{{ $t('EMAIL ADDRESS') }}:</label>
                                <div class="displayTableCell pbm">
                                    <el-input name="shipping_email"
                                              v-model="creditCardForm.shippingAddress.email"
                                              v-validate="'required'"></el-input>
                                    <p role="alert" v-if="errors.first('shipping_email')">
                                        {{ $t('Please enter a valid email address.') }}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>


                    <!-- Payment method -->
                    <div class="g-spec">
                        <div class="g-spec-label nowrap">2) {{ $t('Payment method') }}</div>
                        <div class="g-spec-content">
                            <el-radio-group v-model="paymentType" size="large">
                              <el-radio-button label="CREDIT_CARD">{{ $t('CREDIT CARD') }}</el-radio-button>
                              <el-radio-button label="PAYPAL">{{ $t('PAYPAL') }}</el-radio-button>
                            </el-radio-group>

                            <!-- Credit Card form -->
                            <div class="pvl phm" v-if="paymentType === 'CREDIT_CARD'">
                                <!-- Card Number -->
                                <div class="mbl">
                                    <label class="hosted-field-label">{{ $t('CARD NUMBER') }}</label>
                                    <div id="card-number" class="hosted-field widthAll"></div>
                                    <span id="payment-method-icon"></span>
                                    <!--<span id="payment-method-icon" ng-class="vm.creditCardForm.cardTypeIcon"></span>-->
                                </div>

                                <!-- Expiration -->
                                <div class="mbl">
                                    <label class="hosted-field-label">{{ $t('EXPIRATION') }}</label>
                                    <div id="expiration-date" class="hosted-field"></div>
                                </div>

                                <!-- CVV -->
                                <div class="mbl">
                                    <label class="hosted-field-label">
                                        <a class="underlineDotted" @click="openCvvModal">{{ $t('SECURITY CODE') }}</a>
                                    </label>
                                    <div class="input-group widthAll">
                                        <div id="cvv" class="hosted-field"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Billing -->
                    <div class="g-spec" v-show="paymentType !== 'PAYPAL'">
                        <div class="g-spec-label nowrap">
                            3) {{ $t('Billing') }}
                        </div>
                        <div class="g-spec-content">
                            <div>
                                <el-checkbox v-model="billingSameAsShipping">{{ $t('Same as Shipping address') }}</el-checkbox>
                            </div>

                            <div class="mtl" v-show="!billingSameAsShipping">
                                <!-- Billing: First Name -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('FIRST NAME') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_firstName"
                                                  v-model="creditCardForm.billingAddress.firstName"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_firstName')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: Last Name -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('LAST NAME') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_lastName"
                                                  v-model="creditCardForm.billingAddress.lastName"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_lastName')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: Street Address -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_streetAddress"
                                                  v-model="creditCardForm.billingAddress.streetAddress"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_streetAddress')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: City -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('CITY') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_city"
                                                  v-model="creditCardForm.billingAddress.city"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_city')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: State -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('STATE') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_state"
                                                  v-model="creditCardForm.billingAddress.state"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_state')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: Postal Code -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('POSTAL CODE') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <el-input name="billing_postalCode"
                                                  v-model="creditCardForm.billingAddress.postalCode"
                                                  v-validate="'required'"></el-input>
                                        <p role="alert" v-if="errors.first('billing_postalCode')">
                                            {{ $t('Required') }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Billing: Country -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">{{ $t('COUNTRY') }}:</label>
                                    <div class="field displayTableCell pbm">
                                        <country-select v-model="creditCardForm.billingAddress.country"
                                                        :init-value="creditCardForm.billingAddress.country"
                                                        value-type="alpha2"
                                                        v-on:change="val => { creditCardForm.billingAddress.country = val }"></country-select>
                                    </div>
                                </div>

                                <!-- Billing: Company Name -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm pbm">
                                        {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }}):
                                    </label>
                                    <div class="field displayTableCell pbm">
                                        <el-input v-model="creditCardForm.billingAddress.company"></el-input>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Review -->
                    <div class="g-spec">
                        <div class="g-spec-label nowrap">
                            {{ paymentType === 'PAYPAL' ? '3' : '4' }}) {{ $t('Review items') }}</div>
                        <div class="g-spec-content">
                            TODO
                        </div>
                    </div>


                    <el-dialog :title="$t('Finding your security code')" :visible.sync="cvvModalIsActive">
                        <div class="g-spec">
                            <div class="g-spec-label nowrap">{{ $t('American Express') }}</div>
                            <div class="g-spec-content">
                                <div class="inlineBlock prl">
                                    <img src="/static/images/creditcards/card_back_cvv_4.png">
                                </div>
                                <div class="inlineBlock vat plm">{{ $t('cvv_help_4_digit') }}</div>
                            </div>
                        </div>

                        <div class="g-spec">
                            <div class="g-spec-label nowrap">{{ $t('All other cards') }}</div>
                            <div class="g-spec-content">
                                <div class="inlineBlock prl">
                                    <img src="/static/images/creditcards/card_back_cvv_3.png">
                                </div>
                                <div class="inlineBlock vat plm">{{ $t('cvv_help_3_digit') }}</div>
                            </div>
                        </div>
                    </el-dialog>

                </div>
            </template>
            
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters, mapActions } from 'vuex'
    import { Checkbox, Input, Dialog, RadioGroup, RadioButton } from 'element-ui'
    import CountrySelect from '../../components/CountrySelect.vue'

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Dialog)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)

    export default {
        computed: {
            ...mapGetters([
                'cart'
            ])
        },

        data() {
            return {
                paymentType: 'CREDIT_CARD',
                billingSameAsShipping: false,
                cvvModalIsActive: false,
                creditCardForm: {
                    shippingAddress: {
                        firstName: null,
                        lastName: null,
                        streetAddress: null,
                        extendedAddress: null,
                        city: null,
                        state: null,
                        postalCode: null,
                        country: null,
                        company: null,
                        email: null,
                    },
                    billingAddress: {
                        firstName: null,
                        lastName: null,
                        streetAddress: null,
                        city: null,
                        state: null,
                        postalCode: null,
                        country: null,
                        company: null
                    }
                }
            }
        },

        components: {
            Checkbox,
            CountrySelect
        },

        methods: {
            changed: function(val) {
                this.creditCardForm.shippingAddress.country = val;
                console.log('parent changed', this.creditCardForm.shippingAddress.country)
            },
            openCvvModal: function() {
                this.cvvModalIsActive = true;
            },

            closeCvvModal: function() {
                this.cvvModalIsActive = false;
            },

            copyShippingDataToBillingData: function(checked) {
                console.log("TODO", checked);
            }
        }
    }
</script>

<style lang="scss">

.cvvHelpCell {
    display: inline-block;
    text-align: left;
}

</style>
