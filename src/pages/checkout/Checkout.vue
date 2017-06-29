<template>
    <section>

        <div class="columns pam">
            <div class="column is-8">
                <div class="title">{{ $t('Shopping Cart') }}</div>
            </div>
        </div>

        <div v-if="!this.cart.num_items" class="fs16">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>

        <template v-else>
            <form>

                <!-- Shipping -->
                <div class="g-spec mbl">
                    <div class="g-spec-label">1) {{ $t('Shipping') }}</div>
                    <div class="g-spec-content">

                        <!-- Shipping: First Name -->
                        <!--<div class="field mbm">-->
                            <!--<label class="label required">{{ $t('FIRST NAME') }}</label>-->
                            <!--<p class="control">-->
                                <!--<input type="text"-->
                                       <!--name="shipping_firstName"-->
                                       <!--v-model="creditCardForm.shippingAddress.firstName"-->
                                       <!--v-validate="'required|min:2'"-->
                                       <!--class="input"/>-->
                            <!--</p>-->
                            <!--<p role="alert" v-if="errors.first('shipping_firstName')">-->
                                <!--{{ $t('Alphabetic characters only, please!') }}-->
                            <!--</p>-->
                        <!--</div>-->

                        <!-- Shipping: First Name -->
                        <div class="displayTableRow">
                            <label class="displayTableCell prm pbm">{{ $t('FIRST NAME') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('LAST NAME') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS 2') }}</label>
                            <div class="field displayTableCell pbm">
                                <el-input v-model="creditCardForm.shippingAddress.extendedAddress"></el-input>
                            </div>
                        </div>

                        <!-- Shipping: City -->
                        <div class="displayTableRow">
                            <label class="displayTableCell prm pbm">{{ $t('CITY') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('STATE/PROVINCE') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('POSTAL CODE') }}</label>
                            <div class="field displayTableCell pbm">
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
                            <label class="displayTableCell prm pbm">{{ $t('COUNTRY') }}</label>
                            <div class="field displayTableCell pbm">
                                <country-select v-model="creditCardForm.shippingAddress.country"
                                                :init-value="creditCardForm.shippingAddress.country"
                                                value-type="alpha2"
                                                v-on:change="val => { creditCardForm.shippingAddress.country = val }"></country-select>
                            </div>
                        </div>

                        <!-- Shipping: Company Name -->
                        <div class="displayTableRow">
                            <label class="displayTableCell prm pbm">
                                {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }})
                            </label>
                            <div class="field displayTableCell pbm">
                                <el-input v-model="creditCardForm.shippingAddress.company"></el-input>
                            </div>
                        </div>

                        <!-- Shipping: Email -->
                        <div class="displayTableRow">
                            <label class="displayTableCell prm pbm">{{ $t('EMAIL') }}</label>
                            <div class="field displayTableCell pbm">
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
                    <div class="g-spec-label">2) {{ $t('Payment method') }}</div>
                    <div class="g-spec-content">
                        <div class="tac mbm"><a class="button is-info width200">{{ $t('CREDIT CARD') }}</a></div>
                        <div class="tac">
                            <a class="button is-warning width200"><img src="/static/images/creditcards/paypal_logo.svg" alt="PayPal" style="width:60px"></a>
                        </div>

                        <!-- Credit Card form -->
                        <div class="pvl phm">
                            <!-- Card Number -->
                            <div class="mbl">
                                <label class="hosted-field-label">CARD NUMBER</label>
                                <div id="card-number" class="hosted-field widthAll"></div>
                                <span id="payment-method-icon"></span>
                                <!--<span id="payment-method-icon" ng-class="vm.creditCardForm.cardTypeIcon"></span>-->
                            </div>

                            <!-- Expiration -->
                            <div class="mbl">
                                <label class="hosted-field-label">EXPIRATION</label>
                                <div id="expiration-date" class="hosted-field"></div>
                            </div>

                            <!-- CVV -->
                            <div class="mbl">
                                <label class="hosted-field-label">
                                    <a class="underlineDotted" @click="openCvvModal">SECURITY CODE</a>
                                </label>
                                <div class="input-group widthAll">
                                    <div id="cvv" class="hosted-field"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Billing -->
                <div class="g-spec">
                    <div class="g-spec-label">3) {{ $t('Billing') }}</div>
                    <div class="g-spec-content">

                        <!--<div class="tac" ng-if="creditCardForm.selectedPaymentType !== PAYMENT_TYPE_PAYPAL">-->
                        <div class="tac">
                            <el-checkbox v-model="creditCardForm.billingSameAsShipping">{{ $t('Same as Shipping address') }}</el-checkbox>
                        </div>

                        <!-- Billing: First Name -->
                        <div class="displayTableRow">
                            <label class="displayTableCell prm pbm">{{ $t('FIRST NAME') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('LAST NAME') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('STREET ADDRESS') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('CITY') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('STATE') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('POSTAL CODE') }}</label>
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
                            <label class="displayTableCell prm pbm">{{ $t('COUNTRY') }}</label>
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
                                {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }})
                            </label>
                            <div class="field displayTableCell pbm">
                                <el-input v-model="creditCardForm.billingAddress.company"></el-input>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Review -->
                <div class="g-spec">
                    <div class="g-spec-label">4) {{ $t('Review items') }}</div>
                    <div class="g-spec-content">temp content</div>
                </div>


                <card-modal :visible="cvvModalIsActive"
                            v-on:card_modal_closed="closeCvvModal">
                    <div slot="title">{{ $t('Finding your security code') }}</div>
                    <div slot="content">
                        <div class="pbl">
                            <div class="fs16 fwb pbs">{{ $t('American Express') }}:</div>
                            <div class="displayTableCell prl" style="width:35%">
                                <img src="/static/images/creditcards/card_back_cvv_4.png">
                            </div>
                            <div class="displayTableCell vat plm">{{ $t('cvv_help_4_digit') }}</div>
                        </div>

                        <div>
                            <div class="fs16 fwb pbs">{{ $t('All other cards') }}:</div>
                            <div class="displayTableCell prl" style="width:35%">
                                <img src="/static/images/creditcards/card_back_cvv_3.png">
                            </div>
                            <div class="displayTableCell vat plm">{{ $t('cvv_help_3_digit') }}</div>
                        </div>
                    </div>
                </card-modal>

            </form>
        </template>

    </section>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters, mapActions } from 'vuex'
    import { Checkbox, Input } from 'element-ui'
    import CardModal from '../../components/CardModal.vue'
    import CountrySelect from '../../components/CountrySelect.vue'

    Vue.use(Checkbox)
    Vue.use(Input)

    export default {
        computed: {
            ...mapGetters([
                'cart'
            ])
        },

        data() {
            return {
                cvvModalIsActive: false,
                PAYMENT_TYPE_CREDIT_CARD: 'PAYMENT_TYPE_CREDIT_CARD',
                PAYMENT_TYPE_PAYPAL: 'PAYMENT_TYPE_PAYPAL',
                creditCardForm: {
                    billingSameAsShipping: false,
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
            CardModal,
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
