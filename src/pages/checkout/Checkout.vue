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
                                <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('STREET ADDRESS') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('STREET ADDRESS 2') }}:</label>
                                <div class="checkout_form_value">
                                    <el-input v-model="creditCardForm.shippingAddress.extendedAddress"></el-input>
                                </div>
                            </div>

                            <!-- Shipping: City -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">{{ $t('CITY') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('STATE/PROVINCE') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
                                <div class="checkout_form_value">
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
                                <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
                                <div class="checkout_form_value">
                                    <country-select v-model="creditCardForm.shippingAddress.country"
                                                    :init-value="creditCardForm.shippingAddress.country"
                                                    value-type="alpha2"
                                                    v-on:change="val => { creditCardForm.shippingAddress.country = val }"></country-select>
                                </div>
                            </div>

                            <!-- Shipping: Company Name -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">
                                    {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }}):
                                </label>
                                <div class="checkout_form_value">
                                    <el-input v-model="creditCardForm.shippingAddress.company"></el-input>
                                </div>
                            </div>

                            <!-- Shipping: Email -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">{{ $t('EMAIL ADDRESS') }}:</label>
                                <div class="checkout_form_value">
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
                            <div class="pvl phm" >
                                <!-- Payment type -->
                                <div class="displayTableRow">
                                    <label class="displayTableCell prm vat  ">{{ $t('CHOOSE') }}:</label>
                                    <div class="displayTableCell pbl">
                                        <el-radio-group v-model="paymentType" size="large" v-on:change="paymentTypeChange">
                                            <el-radio-button label="CREDIT_CARD">{{ $t('CREDIT CARD') }}</el-radio-button>
                                            <el-radio-button label="PAYPAL" :disabled="paymentTypePaypalDisabled">{{ $t('PAYPAL') }}</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </div>

                                <!-- Card Number -->
                                <div class="displayTableRow" v-show="paymentType === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">{{ $t('CARD NUMBER') }}:</label>
                                    <div class="checkout_form_value">
                                        <div id="card-number" class="el-input__inner"></div>
                                        <!-- <span id="payment-method-icon" ng-class="vm.creditCardForm.cardTypeIcon"></span> -->
                                    </div>
                                </div>

                                <!-- Expiration -->
                                <div class="displayTableRow" v-show="paymentType === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">{{ $t('EXPIRATION') }}:</label>
                                    <div class="checkout_form_value">
                                        <div id="expiration-date" class="el-input__inner"></div>
                                    </div>
                                </div>

                                <!-- CVV -->
                                <div class="displayTableRow" v-show="paymentType === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">
                                        <a class="underlineDotted" @click="openCvvModal">{{ $t('SECURITY CODE') }}</a>:
                                    </label>
                                    <div class="checkout_form_value">
                                        <div id="cvv" class="el-input__inner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Billing -->
                    <div class="g-spec" v-if="paymentType === 'CREDIT_CARD'">
                        <div class="g-spec-label nowrap">
                            {{ numbers.billing }}) {{ $t('Billing') }}
                        </div>
                        <div class="g-spec-content">
                            <div>
                                <el-checkbox v-model="billingSameAsShipping">&nbsp;{{ $t('Same as Shipping address') }}</el-checkbox>
                            </div>

                            <div class="mtl" v-show="!billingSameAsShipping">
                                <!-- Billing: First Name -->
                                <div class="displayTableRow">
                                    <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('STREET ADDRESS') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('CITY') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('STATE/PROVINCE') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
                                    <div class="checkout_form_value">
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
                                    <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
                                    <div class="checkout_form_value">
                                        <country-select v-model="creditCardForm.billingAddress.country"
                                                        :init-value="creditCardForm.billingAddress.country"
                                                        value-type="alpha2"
                                                        v-on:change="val => { creditCardForm.billingAddress.country = val }"></country-select>
                                    </div>
                                </div>

                                <!-- Billing: Company Name -->
                                <div class="displayTableRow">
                                    <label class="checkout_form_label">
                                        {{ $t('COMPANY NAME') }}<br/>({{ $t('optional') }}):
                                    </label>
                                    <div class="checkout_form_value">
                                        <el-input v-model="creditCardForm.billingAddress.company"></el-input>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Review -->
                    <div class="g-spec">
                        <div class="g-spec-label nowrap">
                            {{ numbers.review }}) {{ $t('Review items') }}</div>
                        <div class="g-spec-content">
                            <cart-items :allow-delete="false"></cart-items>
                        </div>
                    </div>

                    <div class="pal tac" v-show="paymentType !== 'PAYPAL'">
                       <el-button type="warning"
                                  class="colorBlack"
                                  size="large"
                                  @click="tokenizeHostedFields"
                                  :loading="placeOrderButtonLoading"
                                  :disabled="braintree.checkoutButtonDisabled">{{ $t('Place your order') }}</el-button>

                        <div v-show="braintree.checkoutButtonDisabled && paymentType !== 'PAYPAL'" class="colorRed fs16">
                           {{ $t('Please choose a payment method') }}
                        </div>
                    </div>

                    <!-- Security code popup -->
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
    import { mapGetters } from 'vuex'
    import { Checkbox, Input, Dialog, RadioGroup, RadioButton, Notification } from 'element-ui'
    import CountrySelect from '../../components/CountrySelect.vue'
    import CartItems from '../../components/cart/CartItems'

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Dialog)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)

    export default {
        computed: {
            ...mapGetters([
                'cart',
                'appInfo'
            ])
        },

        components: {
            Checkbox,
            CountrySelect,
            CartItems
        },

        data() {
            return {
                numbers: {
                    billing: null,
                    review: 3
                },
                paymentType: null,
                paymentTypePaypalDisabled: false,
                billingSameAsShipping: false,
                cvvModalIsActive: false,
                placeOrderButtonLoading: false,
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
                },
                braintree: {
                    clientInstance: '',
                    tokenizePayload: '',
                    hostedFieldsInstance: '',
                    paypalInstance: '',
                    paymentMethodNonce: null,
                    checkoutButtonDisabled: true,
                    transaction: {
                        nonce: null,
                        payPalPayload: null
                    }
                }
            }
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

            paymentTypeChange: function() {
                switch(this.paymentType) {
                    case 'PAYPAL':
                        this.paypalTransaction();
                        this.numbers.billing = null;
                        this.numbers.review = 3;
                        this.braintree.checkoutButtonDisabled = true;
                        break;

                    case 'CREDIT_CARD':
                        this.numbers.billing = 3;
                        this.numbers.review = 4;
                        this.braintree.checkoutButtonDisabled = false;
                        break;

                    default:
                        this.braintree.checkoutButtonDisabled = true;
                }
            },

            copyShippingDataToBillingData: function(checked) {
                console.log("TODO", checked);
            },

            createBraintree: function() {
                let client = require('braintree-web/client');

                client.create({
                    authorization: this.appInfo.clientToken
                }, (clientErr, clientInstance) => {
                    if (clientErr) {
                        Notification.error({
                            title: this.$t('There was an error setting up the payment client!'),
                            message: clientErr.message,
                            duration: 0
                        });
                    }
                    else {
                      this.braintree.clientInstance = clientInstance
                      this.createHostedFields();
                      this.createPaypal();
                    }
                });
            },

            createHostedFields() {
                let hostedFields = require('braintree-web/hosted-fields');
                hostedFields.create({
                    client: this.braintree.clientInstance,
                    styles: {
                      'input': {
                        'font-size': '18px'
                      },
                      'input.invalid': {
                        'color': 'red'
                      },
                      'input.valid': {
                        'color': 'green'
                      }
                    },
                    fields: {
                        number: {
                            selector: '#card-number'
                            // placeholder: '4111 1111 1111 1111'
                        },
                        cvv: {
                            selector: '#cvv'
                            // placeholder: '123'
                        },
                        expirationDate: {
                            selector: '#expiration-date'
                            // placeholder: '10/2019'
                        }
                    }
                }, (hostedFieldsErr, hostedFieldsInstance) => {
                    if (hostedFieldsErr) {
                        Notification.error({
                            title: this.$t('Payment method error') + ':',
                            message: hostedFieldsErr.message,
                            duration: 0
                        });
                        return;
                    }
                    else {
                        //enable submit button
                        // document.querySelector('#submitTransaction').removeAttribute('disabled');
                        this.braintree.hostedFieldsInstance = hostedFieldsInstance;
                    }
                });
            },

            createPaypal() {
                let paypal = require('braintree-web/paypal');
                paypal.create({
                    client: this.braintree.clientInstance
                }, (createPaypalErr, paypalInstance) => {
                    if (createPaypalErr) {
                        Notification.error({
                            title: this.$t('There was an error setting up the payment input fields!'),
                            message: createPaypalErr.message,
                            duration: 0
                        });
                        this.paymentTypePaypalDisabled = true;
                        return;
                    }
                    else {
                        //enable submit button
                        //document.querySelector('#submitTransaction').removeAttribute('disabled');
                        this.braintree.paypalInstance = paypalInstance;
                        this.paymentTypePaypalDisabled = false;
                    }
                });
            },

            tokenizeHostedFields() {
                this.placeOrderButtonLoading = true;

                this.braintree.hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
                    if (tokenizeErr) {
                        Notification.error({
                            title: this.$t('Payment method error') + ':',
                            message: tokenizeErr.message,
                            duration: 0
                        });

                        this.placeOrderButtonLoading = false;
                        return;
                    }

                    this.braintree.tokenizePayload = payload;
                    this.braintree.paymentMethodNonce = payload.nonce;

                    // teardown HF and present payment information
                    this.braintree.hostedFieldsInstance.teardown((teardownErr) => {
                        if (teardownErr) {
                            console.log('There was an error tearing it down!', teardownErr.message);
                        }
                        else {
                            console.log("hosted fields teardown done")
                        }

                        this.placeOrderButtonLoading = false;
                    });
                });
            },

            paypalTransaction() {
                this.braintree.paypalInstance.tokenize({
                    flow: 'vault'
                }, (pptokenizeErr, paypalPayload) => {
                    if (pptokenizeErr) {
                        let errorMsg = {
                            title: null,
                            message: null,
                            duration: 0
                        };

                        // Handle tokenization errors or premature flow closure
                        switch (pptokenizeErr.code) {
                            case 'PAYPAL_POPUP_CLOSED':
                                console.error('Customer closed PayPal popup.');
                                this.paymentType = 'CREDIT_CARD';
                                break;

                            case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
                                errorMsg.title = $t('PayPal tokenization failed');
                                errorMsg.message = pptokenizeErr.details
                                break;

                            case 'PAYPAL_FLOW_FAILED':
                                errorMsg.title = $t('Unable to initialize PayPal flow. Are your options correct?');
                                errorMsg.message = pptokenizeErr.details
                                break;

                            default:
                                errorMsg.title = $t('There was an error tokenizing PayPal!');
                                errorMsg.message = pptokenizeErr.details
                        }

                        if(errorMsg.title) {
                            Notification.error(errorMsg);
                        }
                    }
                    else {
                        this.braintree.transaction.nonce = paypalPayload.paymentMethodNonce;
                        this.braintree.transaction.payPalPayload = paypalPayload;
                    }
                });
            }
        },

        created() {
          this.createBraintree();
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>

<style lang="scss">
    @import '../../assets/css/components/_variables.scss';

    .checkout_form_label {
        display: table-cell;
        padding: 0 10px 10px 0;
        vertical-align: top;
    }

    .checkout_form_value {
        display: table-cell;
        padding-bottom: 10px;

        .el-input__inner {
            font-size: 20px !important;
            color: $colorGray !important;
            min-width: 200px;
        }
    }

    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }
</style>
