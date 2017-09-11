<template>
    <div>
        <section v-if="cart.num_items" class="container-wizard">
            <div class="container-skinny">
                <checkout-wizard-bar :step="currentStep" @change="checkoutStepChanged"></checkout-wizard-bar>
            </div>
        </section>

        <section class="container-skinny pal">
            <div v-if="!cart.num_items" class="fs16 pal tac">
                {{ $t('Your shopping cart does not contain any items.') }}
            </div>

            <template v-else>
                <!-- Shipping -->
                <div v-show="currentStep === 0" class="displayTable" style="margin:0 auto">
                    <div class="step-title">{{ $t('Shipping address') }}:</div>
                    <!-- <shipping-form v-on:shipping_form_submit="shippingFormDone"></shipping-form> -->
                    <shipping-billing-form type="shipping" @valid="val => { shippingButtonEnabled = val }"></shipping-billing-form>

                    <div class="ptl displayTable" style="margin:0 auto">
                        <shipping-billing-help></shipping-billing-help>
                    </div>

                    <div class="ptl tac">
                        <el-button type="warning"
                                    class="colorBlack"
                                    size="large"
                                    @click="submitShippingForm"
                                    :disabled="!shippingButtonEnabled"
                                    :loading="shippingFormIsLoading">{{ $t('Continue') }}</el-button>

                        <div class="mtm colorGreen" v-show="!shippingButtonEnabled">{{ $t('fill_out_form_warning') }}</div>
                    </div>
                </div>

                <!-- Payment -->
                <div v-show="currentStep === 1">
                    <div class="step-title">{{ $t('Choose a payment method') }}:</div>
                    <payment-method-chooser @change="val => { paymentMethod = val }"></payment-method-chooser>

                    <div v-show="paymentMethod === 'CREDIT_CARD'" class="mtl" style="margin:20px auto 0 auto">
                        <div class="displayTable" style="margin:0 auto">
                            <!-- Card Number -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label fwb">{{ $t('CARD NUMBER') }}:</label>
                                <div class="checkout_form_value">
                                    <div id="card-number" class="el-input__inner "></div>
                                    <span class="card-icon" v-show="cardTypeIcon"><img :src="cardTypeIcon" /></span>
                                    <i v-show="inputClasses['card-number']" :class="inputClasses['card-number']"></i>
                                </div>
                            </div>

                            <!-- Expiration -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label fwb">{{ $t('EXPIRES') }}:</label>
                                <div class="checkout_form_value">
                                    <div class="inlineBlock relative">
                                        <!-- month -->
                                        <div id="expiration-month" class="el-input__inner hostedField60 displayTableCell"></div>

                                        <div class="displayTableCell colorGrayLighter phs vat" style="font-size:22px">/</div>

                                        <!-- year -->
                                        <div id="expiration-year" class="el-input__inner hostedField60 displayTableCell"></div>

                                        <i v-show="inputClasses['expiration-month'] && inputClasses['expiration-year']"
                                        :class="getPaymentMonthYearClass(inputClasses['expiration-month'], inputClasses['expiration-year'])"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- CVV -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label">
                                    <span class="fwb">{{ $t('SECURITY CODE') }}</span>
                                    <span class="colorGrayLighter">({{ securityCodeHint }})</span>:
                                </label>
                                <div class="checkout_form_value">
                                    <div class="displayTableCell relative">
                                        <div id="cvv" class="el-input__inner hostedField80 displayTableCell"></div>
                                        <i v-show="inputClasses.cvv" :class="inputClasses.cvv"></i>
                                    </div>
                                    <div class="displayTableCell plm vam">
                                        <span class="underlineDotted cursorPointer" @click="securityCodeModalShow = true">{{ $t("what's this?") }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Billing address -->
                            <div class="displayTableRow">
                                <div class="checkout_form_label fwb">{{ $t('BILLING ADDRESS') }}:</div>
                                <div class="checkout_form_value">
                                    <el-checkbox v-model="billingSameAsShipping">{{ $t('SAME AS SHIPPING ADDRESS') }}:</el-checkbox>

                                    <div class="pll mts" v-show="billingSameAsShipping">
                                        <shipping-view :show-details="true" :show-email="false"></shipping-view>
                                    </div>

                                    <shipping-billing-form type="billing"
                                                            v-show="!billingSameAsShipping" 
                                                            class="mtl"></shipping-billing-form>
                                </div>
                            </div>
                        </div>

                        <div class="ptl displayTable" style="margin:0 auto">
                            <shipping-billing-help></shipping-billing-help>
                        </div>
                    </div>
                    <div v-show="paymentMethod === 'PAYPAL'" class="colorGreen tac mtl">
                        {{ $t('Your PayPal transaction will be completed on the next page.') }}
                    </div> 

                    <div class="ptl tac">
                        <el-button type="warning"
                                    class="colorBlack"
                                    size="large"
                                    @click="currentStep = 2"
                                    :disabled="!paymentMethodButtonEnabled">{{ $t('Continue') }}</el-button>

                        <div v-show="!paymentMethodButtonEnabled" class="colorGreen tac mtm">
                            {{ $t('fill_out_form_warning') }}
                        </div>
                    </div>
                </div>

                <!-- Review -->
                <div v-show="currentStep === 2">
                    <div class="step-title">{{ $t('Review your order') }}:</div>
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
            </template>

        </section>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.foreach'
    import { Checkbox, Input, Notification, RadioGroup, Radio, Tabs, TabPane, Dialog, Loading } from 'element-ui'
    import Validations from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'
    import CheckoutWizardBar from '../../components/checkout/CheckoutWizardBar'
    import PaymentMethodChooser from '../../components/checkout/PaymentMethodChooser'
    import ShippingForm from '../../components/checkout/ShippingForm'
    import ShippingBillingForm from '../../components/checkout/ShippingBillingForm'
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

    Vue.prototype.$notify = Notification;

    let currentNotification = null;
    let supportedCardIcons = ['american-express', 'diners-club', 'discover', 'jcb', 'maestro', 'master-card', 'visa'];


    export default {
        components: {
            CheckoutWizardBar,
            PaymentMethodChooser,
            ShippingForm,
            ShippingView,
            // ShippingMethodForm,
            ShippingBillingHelp,
            ShippingBillingForm,
            Checkbox,
            CountrySelect,
            CartItems
        },

        computed: {
            ...mapGetters([
                'cart',
                'numCartItems',
                'app'
            ]),

            paymentMethodButtonEnabled: function() {
                if(this.paymentMethod === 'PAYPAL' ||
                    (this.paymentMethod === 'CREDIT_CARD' &&
                    this.inputClasses['card-number'] && 
                    this.inputClasses['card-number'].indexOf('colorGreen') > -1 && 
                    this.inputClasses['expiration-year'] && 
                    this.inputClasses['expiration-year'].indexOf('colorGreen') > -1 && 
                    this.inputClasses['expiration-month'] &&
                    this.inputClasses['expiration-month'].indexOf('colorGreen') > -1 && 
                    this.inputClasses['cvv'] && 
                    this.inputClasses['cvv'].indexOf('colorGreen') > -1)) {
                    return true;
                }

                return false;
            },

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
                    return this.cart.billingSameAsShipping;
                },
                set: function(newVal) {
                    this.$store.dispatch('CART_BILLING_SAME_AS_SHIPPING', newVal);
                }
            }
        },

        data: function() {
            return {
                currentStep: 0,
                shippingFormIsLoading: false,
                shippingButtonEnabled: false,
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
            /**
             * Validates the shipping address
             */
            submitShippingForm: function() {
                let self = this;
                let c = this.cart.shipping;

                this.shippingFormIsLoading = true;

                if(currentNotification) {
                    currentNotification.close();
                }

                api.shoppingCart.validateAddress({
                    company_name: c.company,
                    address_line1: c.streetAddress,
                    city_locality: c.city,
                    state_province: c.state,
                    postal_code: c.postalCode,
                    country_code: c.countryCodeAlpha2
                })
                .then((result) => {
                    let validation = Array.isArray(result) ? result[0] : result;
                    this.shippingFormIsLoading = false;

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

                            // self.$emit('shipping_form_submit')
                            this.shippingFormDone();
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

                            this.shippingFormDone();
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

                    this.shippingFormIsLoading = false;

                    this.$notify({
                        title: msg || "An internal server error occurred",
                        // message: errorMessage,
                        duration: 0,
                        type: 'error'
                    });
                });
            },


            /**
             * As a nice UI convenience, pre-populates the billing form 
             * with some shipping form values if those values are empty
             */
            initBillingForm: function() {
                if(!this.cart.billing.countryCodeAlpha2) {
                    this.cart.billing.countryCodeAlpha2 = this.cart.shipping.countryCodeAlpha2;
                }
                if(!this.cart.billing.state) {
                    this.cart.billing.state = this.cart.shipping.state;
                }
                console.log("INIT BILLING", this.cart.billing)
            },


            /**
             * Get sales tax rate for the given shipping address
             */
            getSalesTax: function() {
                api.salesTax.getSalesTaxAmount({
                    city: this.cart.shipping.city,
                    state: this.cart.shipping.state,
                    countryCodeAlpha2: this.cart.shipping.countryCodeAlpha2,
                    subtotal: this.cart.sub_total,
                    shipping: this.cart.shipping.total
                })
                .then((result) => {
                    this.$store.dispatch('CART_SALES_TAX', result);
                })
                .catch((result) => {
                    currentNotification = this.$notify({
                        title: this.$t('An error occurred'),
                        message: 'We are unable to display the sales tax rate because of a server error.',
                        duration: 0,
                        type: 'error'
                    });
                });
            },


            getShippingRates: function() {
                this.$store.dispatch('CART_SHIPPING_METHODS', null);

                api.shoppingCart.getShippingRates({
                    validate_address: 'no_validation',
                    ship_to: {
                        address_line1: this.cart.shipping.streetAddress,
                        city_locality: this.cart.shipping.city,
                        state_province: this.cart.shipping.state,
                        postal_code: this.cart.shipping.postalCode,
                        country_code: this.cart.shipping.countryCodeAlpha2
                    },
                    packages: [
                        {
                            weight: {
                                value: '6.0',  //TODO
                                unit: 'ounce'
                            }
                        }
                    ]
                })
                .then((result) => {
                    console.log("SHIP METHODS", result);
                    this.$store.dispatch('CART_SHIPPING_METHODS', result);
                })
                .catch((result) => {
                    currentNotification = this.$notify({
                        title: this.$t('An error occurred'),
                        message: 'We were unable to get shipping rates because of a server error.',
                        duration: 0,
                        type: 'error'
                    });
                });
            },


            checkoutStepChanged: function(newStep) {
                if(newStep < this.currentStep) {
                    this.currentStep = newStep;
                }
            },

            /**
             * Callback function called when the submit button clicked in the ShippingForm
             * component.
             */
            shippingFormDone: function() {
                this.initBillingForm();
                this.currentStep = 1;

                //TODO: send latest cart data to backend so sales_tax can be calculated.
            },

            shippingMethodDone: function() {
                this.currentStep = 2;
            },

            shippingMethodGoBack: function() {
                this.currentStep = 0;
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
                    // TODO: update state instead
                    // this.billingFirstName = this.cart.shipping.firstName;
                    // this.billingLastName = this.cart.shipping.lastName;
                    // this.billingStreetAddress = this.cart.shipping.streetAddress;
                    // this.billingCity = this.cart.shipping.city;
                    // this.billingState = this.cart.shipping.state;
                    // this.billingPostalCode = this.cart.shipping.postalCode;
                    // this.billingCountry = this.cart.shipping.countryCodeAlpha2;
                    // this.billingCompany = this.cart.shipping.company;
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
                        shipping: this.cart.shipping,
                        billing: this.cart.billing
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
                    let classesSuccess = ['fa', 'fa-check-circle', 'colorGreen'];
                    let classesError = ['fa', 'fa-times-circle', 'colorRed'];

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

        created() {
            if(this.cart.num_items) {
                let client = require('braintree-web/client');
                client.create(
                    { authorization: this.app.clientToken },
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
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>

<style lang="scss">
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }

    .card-icon {
        position: absolute;
        top: 1px;
        right: 0px;

        img {
            width: 58px;
        }
    }

    .hostedField60 {
        min-width:60px !important;
        width:60px !important;
    }

    .hostedField80 {
        min-width:80px !important;
        width:80px !important;
    }

    .container-wizard {
        padding: 7px;
        background-color: #f1f1f1;
    }

    .step-title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        text-align: center;
    }
</style>
