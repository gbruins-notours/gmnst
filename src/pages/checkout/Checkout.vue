<template>
    <section>
        <page-header :title="$t('Checkout')"></page-header>

        <div class="container">
            <div v-if="!this.cart.num_items" class="fs16 pal tac">
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
                                    {{ $t('COMPANY NAME') }}&nbsp;
                                    <span class="colorGrayLighter">({{ $t('optional') }})</span>:
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
                                <div class="pbl">
                                    <el-radio-group v-model="paymentMethod" size="large" v-on:change="paymentMethodChanged">
                                        <el-radio-button label="CREDIT_CARD">{{ $t('CREDIT CARD') }}</el-radio-button>
                                        <el-radio-button label="PAYPAL">{{ $t('PAYPAL') }}</el-radio-button>
                                        <!-- <div class="inlineBlock mrl">
                                            <el-radio class="radio" label="CREDIT_CARD">{{ $t('CREDIT CARD') }}</el-radio>
                                        </div>
                                        <div class="inlineBlock">
                                            <el-radio class="radio" label="PAYPAL" :disabled="!braintree.paypalInstance">{{ $t('PAYPAL') }}</el-radio>
                                        </div> -->
                                    </el-radio-group>
                                </div>

                                <!-- Card Number -->
                                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">
                                        {{ $t('CARD NUMBER') }}:
                                    </label>
                                    <div class="checkout_form_value">
                                        <div id="card-number" class="el-input__inner displayTableCell"></div>
                                        <i v-show="inputClasses['card-number']"
                                           class="displayTableCell pls vam"
                                           :class="inputClasses['card-number']"></i>
                                        <div class="card-icon" v-show="cardTypeIcon"><img :src="cardTypeIcon" /></div>
                                    </div>
                                </div>

                                <!-- Expiration -->
                                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">
                                        {{ $t('EXPIRATION') }}
                                        <span class="colorGrayLighter">({{ $t('card_expiration_hint') }})</span>:
                                    </label>
                                    <div class="checkout_form_value">
                                        <div id="expiration-date" class="el-input__inner displayTableCell"></div>
                                        <i v-show="inputClasses['expiration-date']"
                                           class="displayTableCell pls vam"
                                           :class="inputClasses['expiration-date']"></i>
                                    </div>
                                </div>

                                <!-- CVV -->
                                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                                    <label class="checkout_form_label">
                                        <span>{{ $t('SECURITY CODE') }}</span>
                                        <span class="colorGrayLighter">({{ securityCodeHint }})</span>:
                                        <div>
                                            <span class="underlineDotted cursorPointer" @click="cvvModalIsActive = true">what's this?</span>
                                        </div>
                                    </label>
                                    <div class="checkout_form_value">
                                        <div id="cvv" class="el-input__inner displayTableCell"></div>
                                        <i v-show="inputClasses.cvv"
                                           class="displayTableCell pls vam"
                                           :class="inputClasses.cvv"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Billing -->
                    <div class="g-spec" v-if="paymentMethod === 'CREDIT_CARD'">
                        <div class="g-spec-label nowrap">
                            {{ numbers.billing }}) {{ $t('Billing') }}
                        </div>
                        <div class="g-spec-content">
                            <div class="pbl">
                                <!-- <el-checkbox v-model="billingSameAsShipping"
                                             v-on:change="copyShippingDataToBillingData">&nbsp;{{ $t('Same as Shipping address') }}</el-checkbox> -->

                                <el-radio-group v-model="billingSameAsShipping" size="large" v-on:change="copyShippingDataToBillingData">
                                    <el-radio-button :label="true">{{ $t('Same as shipping address') }}</el-radio-button>
                                    <el-radio-button :label="false">{{ $t('Use a different billing address') }}</el-radio-button>
                                </el-radio-group>
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
                                        {{ $t('COMPANY NAME') }}&nbsp;
                                        <span class="colorGrayLighter">({{ $t('optional') }})</span>:
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
                            <cart-items :allow-edit="false"></cart-items>
                        </div>
                    </div>

                    <div class="pal tac" v-show="paymentMethod !== 'PAYPAL'">
                       <el-button type="warning"
                                  class="colorBlack"
                                  size="large"
                                  @click="tokenizeHostedFields"
                                  :loading="placeOrderButtonLoading"
                                  :disabled="!checkoutButtonEnabled">{{ $t('Place your order') }}</el-button>

                        <div v-show="!checkoutButtonEnabled && paymentMethod !== 'PAYPAL'" class="colorRed fs16">
                           {{ $t('Please choose a payment method') }}
                        </div>
                    </div>
                </div>
            </template>
        </div>


        <!-- Security code popup -->
        <el-dialog :title="$t('Finding your security code')"
                   :visible.sync="cvvModalIsActive"
                   :modal-append-to-body="false">
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

    </section>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.forEach'
    import { Checkbox, Input, Dialog, RadioGroup, RadioButton, Radio, Notification } from 'element-ui'
    import CountrySelect from '../../components/CountrySelect.vue'
    import CartItems from '../../components/cart/CartItems'
    import PageHeader from '../../components/PageHeader.vue'
    import VeeValidate from 'vee-validate'

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Dialog)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)
    Vue.use(Radio)
    Vue.use(VeeValidate)

    let supportedCardIcons = ['american-express', 'diners-club', 'discover', 'jcb', 'maestro', 'master-card', 'visa'];

    export default {
        computed: {
            ...mapGetters([
                'cart',
                'numCartItems',
                'appInfo'
            ]),

            checkoutButtonEnabled: function() {
                return (this.paymentMethod === 'CREDIT_CARD' && !this.errors.any());
            },

            cardTypeIcon: function() {
                if(supportedCardIcons.indexOf(this.cardType) > -1) {
                    return `/static/images/creditcards/${this.cardType}.png`;
                }
                return null;
            }
        },

        components: {
            Checkbox,
            CountrySelect,
            CartItems,
            PageHeader
        },

        data() {
            return {
                numbers: {
                    billing: 3,
                    review: 4
                },
                paymentMethod: 'CREDIT_CARD',
                cardType: null,
                securityCodeHint: `3 ${this.$tc('digits_text', 3)}`,
                billingSameAsShipping: false,
                cvvModalIsActive: false,
                placeOrderButtonLoading: false,
                inputClasses: {
                    'card-number': null,
                    'expiration-date': null,
                    'cvv': null,
                },
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
                        countryInit: null,
                        company: null
                    }
                },
                braintree: {
                    clientInstance: null,
                    tokenizePayload: '',
                    hostedFieldsInstance: null,
                    paypalInstance: null,
                    paymentMethodNonce: null,
                    transaction: {
                        nonce: null,
                        payPalPayload: null
                    }
                }
            }
        },

        methods: {
            paymentMethodChanged: function() {
                switch(this.paymentMethod) {
                    case 'PAYPAL':
                        this.paypalTransaction();
                        this.numbers.billing = null;
                        this.numbers.review = 3;
                        break;

                    default:
                        this.numbers.billing = 3;
                        this.numbers.review = 4;
                        break;
                }
            },


            setPaymentMethod: function(paymentMethod) {
                this.paymentMethod = paymentMethod;
                this.paymentMethodChanged()
            },


            /**
             * Copies the shippingAddress values into the billingAddress values
             *
             * NOTE: This should be done right before submitting the form data,
             * otherwise any shipping data modified after copying will not make
             * it into the billing data
             */
            copyShippingDataToBillingData: function() {
                if(this.billingSameAsShipping) {
                    forEach(this.creditCardForm.shippingAddress, (val, key) => {
                        if(key !== 'email') {
                            this.creditCardForm.billingAddress[key] = val;
                        }
                    });
                }
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
                            selector: '#card-number',
                            placeholder: '•••• •••• •••• ••••'
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: '•••'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: this.$t('card_expiration_hint')
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
                        this.setHostedFieldsEventHandlers(hostedFieldsInstance);
                    }
                });
            },

            setHostedFieldsEventHandlers: function(hostedFieldsInstance) {

                function getElementId(field) {
                    if(isObject(field) && isObject(field.container)) {
                        return field.container.id;
                    }
                    return null;
                }

                hostedFieldsInstance.on('validityChange', (event) => {
                    let field = event.fields[event.emittedBy];
                    let id = getElementId(field);
                    let classesSuccess = ['el-icon-circle-check', 'colorGreen'];
                    let classesError = ['el-icon-circle-cross', 'colorRed'];

                    console.log("ON VALIDITY CHANGE", field, id, event.isValid)

                    if(id) {
                        if (field.isValid === false && !field.isPotentiallyValid) {
                            this.inputClasses[id] = classesError;
                        }
                        else if (field.isValid === true) {
                            this.inputClasses[id] = classesSuccess;
                        }
                        else {
                            this.inputClasses[id] = null;
                        }
                    }
                });

//TODO
                hostedFieldsInstance.on('cardTypeChange', (event) => {
                    // console.log('cardTypeChange', event);
                    let isPotentiallyValid = (isObject(event.fields) && isObject(event.fields.number) && !event.fields.number.isPotentiallyValid);

                    if(isPotentiallyValid) {
                        this.cardType = null;
                    }

                    // Change card bg depending on card type
                    if (event.cards.length === 1) {
                        // Change the CVV length for AmericanExpress cards
                        if (event.cards[0].code.size === 4) {
                            hostedFieldsInstance.setPlaceholder('cvv', '••••');
                            this.securityCodeHint = `4 ${this.$tc('digits_text', 4)}`;
                        }

                        if(!isPotentiallyValid) {
                            this.cardType = event.cards[0].type;
                        }
                    }
                    else {
                        hostedFieldsInstance.setPlaceholder('cvv', '•••');
                        this.securityCodeHint = `3 ${this.$tc('digits_text', 3)}`;

                        if(!isPotentiallyValid) {
                            this.cardType = null;
                        }
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
                        return;
                    }
                    else {
                        this.braintree.paypalInstance = paypalInstance;
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

                    // Not sure why this is needed.  Commenting out for now:
                    // this.braintree.tokenizePayload = payload;
                    // this.braintree.paymentMethodNonce = payload.nonce;

                    //TODO: send payload.nonce to your server (with shipping/billing info)

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
                this.braintree.paypalInstance.tokenize(
                    { flow: 'vault' },
                    (pptokenizeErr, paypalPayload) => {
                        if (pptokenizeErr) {
                            let errorMsg = {
                                title: null,
                                message: null,
                                duration: 0
                            };

                            // Handle tokenization errors or premature flow closure
                            switch (pptokenizeErr.code) {
                                case 'PAYPAL_POPUP_CLOSED':
                                    // console.error('Customer closed PayPal popup.');
                                    this.setPaymentMethod('CREDIT_CARD')
                                    break;

                                case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
                                case 'PAYPAL_FLOW_FAILED':
                                    errorMsg.title = $t(pptokenizeErr.code);
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
                            console.log("PAYPAL NONCE", paypalPayload.paymentMethodNonce)
                        }
                    }
                );
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
    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }

    .card-icon {
        padding-top: 2px;
        width: 50px;
    }
</style>
