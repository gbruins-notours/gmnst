<template>
    <section class="container ptl">

        <div v-if="!this.cart.num_items" class="fs16 pal tac">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>

        <template v-else>
            <div class="g-spec no-zebra">
                <div class="g-spec-label nowrap">
                    <div v-for="(step, index) in steps"
                         :key="index"
                         class="checkout-wizard-row"
                         :class="{'before': index < currentStep, 'after': index > currentStep }">
                         <span class="checkout-wizard-row-label" @click="checkoutStepChanged(index)">{{step.label}}</span>&nbsp;
                         <i class="fa" :class="{'fa-check-circle': index < currentStep, 'fa-arrow-circle-right': index === currentStep}"></i>
                    </div>
                </div>
                <div class="g-spec-content">
                    <shipping-form v-show="currentStep === 0"
                                   v-on:shipping_form_submit="shippingFormDone"></shipping-form>

                    <!-- <shipping-method-form v-show="currentStep === 1"
                                          v-on:shipping_method_submit="shippingMethodDone"
                                          v-on:shipping_method_go_back="shippingMethodGoBack"></shipping-method-form> -->

                    <div v-show="currentStep === 1">
                        <!-- Payment method -->
                        <div class="fwb">
                            <el-radio-group v-model="paymentMethod">
                                <el-radio label="CREDIT_CARD">{{ $t('CREDIT CARD') }}</el-radio>
                                <el-radio label="PAYPAL">{{ $t('PAYPAL') }}</el-radio>
                            </el-radio-group>
                        </div>

                        <div v-show="paymentMethod === 'CREDIT_CARD'" class="pal">
                            <!-- Card Number -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">{{ $t('CARD NUMBER') }}:</label>
                                <div class="checkout_form_value">
                                    <div id="card-number" class="el-input__inner displayTableCell"></div>
                                    <i v-show="inputClasses['card-number']"
                                        class="displayTableCell pls vam"
                                        :class="inputClasses['card-number']"></i>
                                    <div class="card-icon" v-show="cardTypeIcon"><img :src="cardTypeIcon" /></div>
                                </div>
                            </div>

                            <!-- Expiration -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">{{ $t('EXPIRES') }}:</label>
                                <div class="checkout_form_value">
                                    <!-- month -->
                                    <div id="expiration-month" class="el-input__inner hostedField60 displayTableCell"></div>

                                    <div class="displayTableCell colorGrayLighter phs vat" style="font-size:22px">/</div>

                                    <!-- year -->
                                    <div id="expiration-year" class="el-input__inner hostedField60 displayTableCell"></div>

                                    <i v-show="inputClasses['expiration-month'] && inputClasses['expiration-year']"
                                        class="displayTableCell pls vam"
                                        :class="getPaymentMonthYearClass(inputClasses['expiration-month'], inputClasses['expiration-year'])"></i>
                                </div>
                            </div>

                            <!-- CVV -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">
                                    <span>{{ $t('SECURITY CODE') }}</span>
                                    <span class="colorGrayLighter">({{ securityCodeHint }})</span>:
                                </label>
                                <div class="checkout_form_value">
                                    <div id="cvv" class="el-input__inner hostedField80 displayTableCell"></div>
                                    <i v-show="inputClasses.cvv"
                                        class="displayTableCell pls vam"
                                        :class="inputClasses.cvv"></i>
                                    <div>
                                        <span class="underlineDotted cursorPointer" @click="securityCodeModalShow = true">{{ $t("what's this?") }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- BILLING ADDRESS -->
                            <div id="billing_addr_check" class="fwb">
                                <el-checkbox v-model="billingSameAsShipping">{{ $t('BILLING ADDRESS SAME AS SHIPPING') }}</el-checkbox>
                            </div>

                            <div class="ptm pls">
                                <!-- <div class="fwb mbm">{{ $t('Billing address') }}:</div> -->
                                <shipping-view :show-details="true"
                                                :show-email="false"
                                                v-show="billingSameAsShipping"></shipping-view>

                                <div v-show="!billingSameAsShipping">
                                    <!-- Billing: First Name -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('FIRST NAME') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingFirstName" @input="$v.billingFirstName.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingFirstName.$dirty && !$v.billingFirstName.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: Last Name -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('LAST NAME') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingLastName" @input="$v.billingLastName.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingLastName.$dirty && !$v.billingLastName.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: Street Address -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('STREET ADDRESS') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingStreetAddress" @input="$v.billingStreetAddress.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingStreetAddress.$dirty && !$v.billingStreetAddress.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: City -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('CITY') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingCity" @input="$v.billingCity.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingCity.$dirty && !$v.billingCity.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: State -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('STATE/PROVINCE/REGION') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingState" @input="$v.billingState.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingState.$dirty && !$v.billingState.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: Postal Code -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('POSTAL CODE') }}:</label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingPostalCode" @input="$v.billingPostalCode.$touch()"></el-input>
                                            <p role="alert" v-if="$v.billingPostalCode.$dirty && !$v.billingPostalCode.required">{{ $t('Required') }}</p>
                                        </div>
                                    </div>

                                    <!-- Billing: Country -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">{{ $t('COUNTRY') }}:</label>
                                        <div class="checkout_form_value">
                                            <country-select v-model="billingCountry"
                                                          :init-value="billingCountry"
                                                          value-type="alpha2"
                                                          v-on:change="val => { billingCountry = val }"></country-select>
                                        </div>
                                    </div>

                                    <!-- Billing: Company Name -->
                                    <div class="displayTableRow">
                                        <label class="checkout_form_label">
                                            {{ $t('COMPANY NAME') }}
                                            &nbsp;<span class="colorGrayLighter">({{ $t('optional') }})</span>:
                                        </label>
                                        <div class="checkout_form_value">
                                            <el-input v-model="billingCompany"></el-input>
                                        </div>
                                    </div>

                                    <div class="ptl">
                                      <shipping-billing-help></shipping-billing-help>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end payment method -->

                        <!-- Review -->
                        <cart-items :allow-edit="false"
                                    :show-shipping-cost="true"
                                    :show-sales-tax="true"></cart-items>

                        <!-- Submit button -->
                        <div class="pal tac">
                           <el-button v-show="paymentMethod !== 'PAYPAL'"
                                      type="warning"
                                      class="colorBlack"
                                      size="large"
                                      @click="tokenizeHostedFields"
                                      :loading="placeOrderButtonLoading"
                                      :disabled="!checkoutButtonEnabled">{{ $t('Place your order') }}</el-button>

                          <el-button v-show="paymentMethod === 'PAYPAL'"
                                     type="warning"
                                     class="colorBlack"
                                     size="large"
                                     @click="tokenizePaypal"
                                     :disabled="!checkoutButtonEnabled">{{ $t('Pay with PAYPAL') }}</el-button>

                            <div v-show="!checkoutButtonEnabled && paymentMethod !== 'PAYPAL'" class="colorRed fs16">
                               {{ $t('Please choose a payment method') }}
                            </div>
                        </div>

                        <!-- CVV Modal -->
                        <el-dialog :title="$t('Finding your security code')"
                                   :visible.sync="securityCodeModalShow"
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
                    </div>
                    <!-- end step 3 -->
                </div>
            </div>
        </template>

    </section>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.forEach'
    import { Checkbox, Input, Notification, RadioGroup, Radio, Tabs, TabPane, Dialog } from 'element-ui'
    import Validations from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'
    import ShippingForm from '../../components/checkout/ShippingForm'
    // import ShippingMethodForm from '../../components/checkout/ShippingMethodForm'
    import CountrySelect from '../../components/CountrySelect.vue'
    import CartItems from '../../components/cart/CartItems'
    import ShippingView from '../../components/checkout/ShippingView.vue'
    import ShippingBillingHelp from '../../components/checkout/ShippingBillingHelp.vue'
    import api from '../../util/api'

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(RadioGroup)
    Vue.use(Radio)
    Vue.use(Dialog)
    Vue.use(Validations)

    let supportedCardIcons = ['american-express', 'diners-club', 'discover', 'jcb', 'maestro', 'master-card', 'visa'];


    export default {
        components: {
            ShippingForm,
            ShippingView,
            // ShippingMethodForm,
            ShippingBillingHelp,
            Checkbox,
            CountrySelect,
            CartItems
        },

        computed: {
            ...mapGetters([
                'cart',
                'checkout',
                'numCartItems',
                'appInfo'
            ]),

            checkoutButtonEnabled: function() {
                return true;
                // return (this.paymentMethod === 'CREDIT_CARD' && !this.$v.$invalid);
            },

            cardTypeIcon: function() {
                if(supportedCardIcons.indexOf(this.cardType) > -1) {
                    return `/static/images/creditcards/${this.cardType}.png`;
                }
                return null;
            },

            billingSameAsShipping: {
                get: function() {
                    return this.$store.state.checkout.billingSameAsShipping;
                },
                set: function(newVal) {
                    this.$store.dispatch('CHECKOUT_BILLING_SAME_AS_SHIPPING', newVal);
                }
            },

            billingFirstName: {
                get: function() {
                    return this.getBillingAttribute('firstName');
                },
                set: function(newVal) {
                    this.setBillingAttribute('firstName', newVal)
                }
            },
            billingLastName: {
                get: function() {
                    return this.getBillingAttribute('lastName');
                },
                set: function(newVal) {
                    this.setBillingAttribute('lastName', newVal)
                }
            },
            billingStreetAddress: {
                get: function() {
                    return this.getBillingAttribute('streetAddress');
                },
                set: function(newVal) {
                    this.setBillingAttribute('streetAddress', newVal)
                }
            },
            billingCity: {
                get: function() {
                    return this.getBillingAttribute('city');
                },
                set: function(newVal) {
                    this.setBillingAttribute('city', newVal)
                }
            },
            billingState: {
                get: function() {
                    return this.getBillingAttribute('state');
                },
                set: function(newVal) {
                    this.setBillingAttribute('state', newVal)
                }
            },
            billingPostalCode: {
                get: function() {
                    return this.getBillingAttribute('postalCode');
                },
                set: function(newVal) {
                    this.setBillingAttribute('postalCode', newVal)
                }
            },
            billingCountry: {
                get: function() {
                    return this.getBillingAttribute('countryCodeAlpha2');
                },
                set: function(newVal) {
                    this.setBillingAttribute('countryCodeAlpha2', newVal)
                }
            },
            billingCompany: {
                get: function() {
                    return this.getBillingAttribute('company');
                },
                set: function(newVal) {
                    this.setBillingAttribute('company', newVal)
                }
            }
        },

        data: function() {
            return {
                steps: [
                    { label: this.$t('Shipping address'), id: 'shipping_address' },
                    // { label: this.$t('Shipping method'), id: 'shipping_method' },
                    { label: this.$t('Place your order'), id: 'place_order' },
                ],
                currentStep: 0,
                paymentMethod: 'CREDIT_CARD',
                cardType: null,
                securityCodeModalShow: false,
                securityCodeHint: `3 ${this.$tc('digits_text', 3)}`,
                placeOrderButtonLoading: false,
                inputClasses: {
                    'card-number': null,
                    'expiration-year': null,
                    'expiration-month': null,
                    'cvv': null,
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
            checkoutStepChanged: function(newStep) {
                if(newStep < this.currentStep) {
                    this.currentStep = newStep;
                }
            },

            shippingFormDone: function() {
                this.currentStep = 1;

                // get sales tax rate for the given shipping address
                api.salesTax.getSalesTaxAmount({
                    city: this.checkout.shipping.city,
                    state: this.checkout.shipping.state,
                    countryCodeAlpha2: this.checkout.shipping.countryCodeAlpha2,
                    subtotal: this.cart.sub_total,
                    shipping: this.appInfo.shipping.flatCost
                })
                .then((result) => {
                    this.$store.dispatch('CHECKOUT_SALES_TAX', result);
                })
                .catch((result) => {
                    currentNotification = this.$notify({
                        title: this.$t('An error occurred'),
                        message: 'We were unable to get shipping rates because of a server error.',
                        duration: 0,
                        type: 'error'
                    });
                });

                // this.$store.dispatch('CHECKOUT_SHIPPING_METHODS', null);

                // api.shoppingCart.getShippingRates({
                //     validate_address: 'no_validation',
                //     ship_to: {
                //         address_line1: this.checkout.shipping.streetAddress,
                //         city_locality: this.checkout.shipping.city,
                //         state_province: this.checkout.shipping.state,
                //         postal_code: this.checkout.shipping.postalCode,
                //         country_code: this.checkout.shipping.countryCodeAlpha2
                //     },
                //     packages: [
                //         {
                //             weight: {
                //                 value: '6.0',  //TODO
                //                 unit: 'ounce'
                //             }
                //         }
                //     ]
                // })
                // .then((result) => {
                //     console.log("SHIP METHODS", result);
                //     this.$store.dispatch('CHECKOUT_SHIPPING_METHODS', result);
                // })
                // .catch((result) => {
                //     currentNotification = this.$notify({
                //         title: this.$t('An error occurred'),
                //         message: 'We were unable to get shipping rates because of a server error.',
                //         duration: 0,
                //         type: 'error'
                //     });
                // });
            },

            shippingMethodDone: function() {
                this.currentStep = 2;
            },

            shippingMethodGoBack: function() {
                this.currentStep = 0;
            },

            setBillingAttribute: function(attribute, value) {
                this.$store.dispatch('CHECKOUT_BILLING_ATTRIBUTE', {
                    attribute,
                    value
                });
            },

            getBillingAttribute: function(attribute) {
                return this.$store.state.checkout.billing[attribute];
            },

            getPaymentMonthYearClass: function(monthClasses, yearClasses) {
                if(Array.isArray(monthClasses) && Array.isArray(yearClasses)) {
                    if(monthClasses[0] === yearClasses[0]) {
                        return monthClasses;
                    }
                    // find which set has the error classes and return those;
                    else if(monthClasses[0] === 'el-icon-circle-cross') {
                        return monthClasses;
                    }
                    else {
                        return yearClasses;
                    }
                }
            },

            /**
             * Copies the shippingAddress values into the billingAddress values
             */
            copyShippingDataToBillingData: function() {
                if(this.billingSameAsShipping) {
                    this.billingFirstName = this.$store.state.checkout.shipping.firstName;
                    this.billingLastName = this.$store.state.checkout.shipping.lastName;
                    this.billingStreetAddress = this.$store.state.checkout.shipping.streetAddress;
                    this.billingCity = this.$store.state.checkout.shipping.city;
                    this.billingState = this.$store.state.checkout.shipping.state;
                    this.billingPostalCode = this.$store.state.checkout.shipping.postalCode;
                    this.billingCountry = this.$store.state.checkout.shipping.countryCodeAlpha2;
                    this.billingCompany = this.$store.state.checkout.shipping.company;
                }
            },

            getBraintreeErrorMessage: function(clientErr) {
                let errorMessage = clientErr;

                if(isObject(clientErr) && clientErr.hasOwnProperty('code')) {
                    api.logger('error', clientErr.code);

                    // https://github.com/braintree/braintree-web/blob/3beb6d43b1c453e3c97f01129fa07a89234b2003/src/hosted-fields/shared/errors.js
                    // Not translating all errors, just the ones that could be caused by the user
                    switch(clientErr.code) {
                        case 'HOSTED_FIELDS_FIELDS_EMPTY':
                            errorMessage = this.$t('braintree.HOSTED_FIELDS_FIELDS_EMPTY');
                            break;

                        case 'HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED':
                            errorMessage = this.$t('braintree.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED');
                            break;

                        default:
                            if(clientErr.hasOwnProperty('message')) {
                                errorMessage = clientErr.message;
                            }
                            else {
                                errorMessage = clientErr.code;
                            }
                    }
                }
                else {
                    api.logger('error', clientErr);
                }

                return errorMessage;
            },

            tokenizeHostedFields() {
                this.placeOrderButtonLoading = true;
                this.copyShippingDataToBillingData();

                this.braintree.hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
                    if (tokenizeErr) {
                        Notification.error({
                            title: this.$t('Payment method error') + ':',
                            message: this.getBraintreeErrorMessage(tokenizeErr),
                            duration: 0
                        });

                        this.placeOrderButtonLoading = false;
                        return;
                    }

                    // Not sure why this is needed.  Commenting out for now:
                    // this.braintree.tokenizePayload = payload;
                    // this.braintree.paymentMethodNonce = payload.nonce;
                    console.log("TOKENIZED PAYLOAD", payload)
                    console.log("NONCE", payload.nonce)
                    // return;

                    api.shoppingCart.checkout({
                        nonce: payload.nonce,
                        shipping: this.$store.state.checkout.shipping,
                        billing: this.$store.state.checkout.billing
                    })
                    .then((result) => {

                    })
                    .catch((err) => {

                    })
                    .finally(() => {
                        // teardown HF and present payment information
                        this.braintree.hostedFieldsInstance.teardown((teardownErr) => {
                            if (teardownErr) {
                                console.log('There was an error tearing it down!', teardownErr.message);
                                this.getBraintreeErrorMessage(teardownErr);
                            }
                            else {
                                console.log("hosted fields teardown done")
                            }

                            this.placeOrderButtonLoading = false;
                        });
                    })
                });
            },

            tokenizePaypal() {
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
                                    this.paymentMethod = 'CREDIT_CARD'
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

                    // console.log("ON VALIDITY CHANGE", field, id, event.isValid)

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

            createHostedFields: function(clientInstance) {
                let hostedFields = require('braintree-web/hosted-fields');
                hostedFields.create({
                    client: clientInstance,
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
                        expirationMonth: {
                            selector: '#expiration-month',
                            placeholder: this.$t('card_expiration_month_hint')
                        },
                        expirationYear: {
                            selector: '#expiration-year',
                            placeholder: this.$t('card_expiration_year_hint')
                        }
                    }
                }, (hostedFieldsErr, hostedFieldsInstance) => {
                    if (hostedFieldsErr) {
                        Notification.error({
                            title: this.$t('Payment method error') + ':',
                            message: this.getBraintreeErrorMessage(hostedFieldsErr),
                            duration: 0
                        });
                        return;
                    }
                    else {
                        this.braintree.hostedFieldsInstance = hostedFieldsInstance;
                        this.setHostedFieldsEventHandlers(hostedFieldsInstance);
                    }
                });
            },

            createPaypal: function(clientInstance) {
                let paypal = require('braintree-web/paypal');
                paypal.create(
                    { client: clientInstance },
                    (createPaypalErr, paypalInstance) => {
                        if (createPaypalErr) {
                            Notification.error({
                                title: this.$t('There was an error setting up the payment input fields!'),
                                message: this.getBraintreeErrorMessage(createPaypalErr),
                                duration: 0
                            });
                            return;
                        }

                        this.braintree.paypalInstance = paypalInstance;
                    }
                );
            }
        },

        validations: {
            billingFirstName: { required },
            billingLastName: { required },
            billingStreetAddress: { required },
            billingCity: { required },
            billingState: { required },
            billingPostalCode: { required }
        },

        created() {
            let client = require('braintree-web/client');
            client.create(
                { authorization: this.appInfo.clientToken },
                (clientErr, clientInstance) => {
                    if (clientErr) {
                        Notification.error({
                            title: this.$t('There was an error setting up the payment client!'),
                            message: this.getBraintreeErrorMessage(clientErr),
                            duration: 0
                        });
                    }
                    else {
                      this.braintree.clientInstance = clientInstance
                      this.createHostedFields(clientInstance);
                      this.createPaypal(clientInstance);
                    }
                }
            );
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>

<style lang="scss">
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .checkout-wizard-row {
        padding: 6px 0;
        line-height: 14px;
        white-space: nowrap;
        color: #000;
        font-size: 20px;

        &.before,
        &.before i {
            color: $colorGreen;
            font-size: 16px !important;
            font-weight: normal !important;
        }

        &.before .checkout-wizard-row-label {
            text-decoration: underline;
            cursor: pointer;

            &:hover {
                text-decoration: none;
            }
        }

        &.after,
        &.after {
            color: $colorGrayLighter;
            font-size: 16px !important;
            font-weight: normal !important;
        }
        &.after:hover {
            text-decoration: none;
        }
    }
    .checkout-wizard-row > i {
        font-size: 14px;
    }


    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }

    .card-icon {
        padding-top: 2px;
        width: 50px;
    }

    .hostedField60 {
        min-width:60px !important;
        width:60px !important;
    }

    .hostedField80 {
        min-width:80px !important;
        width:80px !important;
    }

    #billing_addr_check {
        margin: 40px 0 0 -20px;
    }
</style>
