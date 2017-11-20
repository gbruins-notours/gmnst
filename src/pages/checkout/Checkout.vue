<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.foreach'
    import Promise from 'bluebird';
    import { Checkbox, Input, Notification, RadioGroup, Radio, Tabs, TabPane, Loading, Dialog } from 'element-ui'
    import Validations from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'
    import CheckoutWizardBar from '../../components/checkout/CheckoutWizardBar'
    import PaymentMethodChooser from '../../components/checkout/PaymentMethodChooser'
    import ShippingBillingForm from '../../components/checkout/ShippingBillingForm'
    import CountrySelect from '../../components/CountrySelect'
    import CartItems from '../../components/cart/CartItems'
    import CartTotalsTable from '../../components/cart/CartTotalsTable'
    import ShippingView from '../../components/checkout/ShippingView'
    import ShippingBillingHelp from '../../components/checkout/ShippingBillingHelp'
    import BottomPopover from '../../components/BottomPopover'
    import CreditCardIcon from '../../components/CreditCardIcon'
    import api from '../../util/api'
    import ShoppingCartService from '../cart/shopping_cart_service.js'

    let shoppingCartService = new ShoppingCartService();

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(RadioGroup)
    Vue.use(Radio)
    Vue.use(Validations)
    Vue.use(Dialog)

    Vue.prototype.$notify = Notification;

    let currentNotification = null;

    export default {
        components: {
            CheckoutWizardBar,
            PaymentMethodChooser,
            ShippingView,
            ShippingBillingHelp,
            ShippingBillingForm,
            Checkbox,
            CountrySelect,
            CartItems,
            BottomPopover,
            CreditCardIcon,
            CartTotalsTable
        },

        computed: {
            ...mapGetters([
                'cart',
                'cartShippingAttributes',
                'cartBillingAttributes',
                'app',
                'braintreeClientToken'
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

            billingSameAsShipping: {
                get: function() {
                    return this.cart.billingSameAsShipping;
                },
                set: function(newVal) {
                    // this.$store.dispatch('CART_BILLING_SAME_AS_SHIPPING', newVal);
                    this.$store.dispatch('CART_ATTRIBUTE_SET', {
                        attribute: 'billingSameAsShipping',
                        value: newVal
                    });
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
                placeOrderPaypalButtonLoading: false,
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
            updateShippingStateFromValidation: function(obj) {
                let c = this.cart;

                c.shipping_company = obj.company_name
                c.shipping_streetAddress = obj.address_line1
                c.shipping_city = obj.city_locality
                c.shipping_state = obj.state_province
                c.shipping_postalCode = obj.postal_code
                c.shipping_countryCodeAlpha2 = obj.country_code
            },

            /**
             * Validates the shipping address
             */
            submitShippingForm: function() {
                let self = this;
                let c = this.cart;

                this.shippingFormIsLoading = true;

                if(currentNotification) {
                    currentNotification.close();
                }

                shoppingCartService.validateAddress({
                    company_name: c.shipping_company,
                    address_line1: c.shipping_streetAddress,
                    city_locality: c.shipping_city,
                    state_province: c.shipping_state,
                    postal_code: c.shipping_postalCode,
                    country_code: c.shipping_countryCodeAlpha2
                })
                .then((result) => {
                    let validation = Array.isArray(result) ? result[0] : result;
                    this.shippingFormIsLoading = false;

                    // Add the validated values to the state
                    switch(validation.status) {
                        case 'verified':
                            this.updateShippingStateFromValidation(validation.matched_address);
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
                            this.updateShippingStateFromValidation(validation.original_address);
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


            submitPaymentForm: function() {
                if(this.cart.billingSameAsShipping) {
                    shoppingCartService.copyShippingStateToBillingState(this.cart);
                }
                this.currentStep = 2
            },


            getShippingRates: function() {
                this.$store.dispatch('CART_SHIPPING_METHODS', null);

                shoppingCartService.getShippingRates({
                    validate_address: 'no_validation',
                    ship_to: {
                        address_line1: this.cart.shipping_streetAddress,
                        city_locality: this.cart.shipping_city,
                        state_province: this.cart.shipping_state,
                        postal_code: this.cart.shipping_postalCode,
                        country_code: this.cart.shipping_countryCodeAlpha2
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

            shippingFormDone: function() {
                let updatedCart = null;
                delete this.cartShippingAttributes.shipping_total;

                // Setting the shipping address will also calculate the
                // sales tax for the cart because sales tax calculation requires
                // knowledge of the destination.  Sales tax needs to be set so
                // the API can return the shipping/tax/grand total amounts for the 'review'
                // checkout step
                shoppingCartService
                    .setShippingAddress(this.cartShippingAttributes)
                    .then((result) => {
                        updatedCart = result;
                        return this.$store.dispatch('CART_SET', result);
                    })
                    .then(() => { 
                        // As a convenience to the user keeping the Country and State
                        // values the same as the shipping values, as they are likely the same
                        if(!updatedCart.billing_countryCodeAlpha2) {
                            this.$store.dispatch('CART_ATTRIBUTE_SET', {
                                attribute: 'billing_countryCodeAlpha2',
                                value: updatedCart.shipping_countryCodeAlpha2
                            });
                        }
                        if(!updatedCart.billing_state) {
                            this.$store.dispatch('CART_ATTRIBUTE_SET', {
                                attribute: 'billing_state',
                                value: updatedCart.shipping_state
                            });
                        }

                        this.currentStep = 1;
                    })
                    .catch((result) => {
                        // currentNotification = this.$notify({
                        //     title: this.$t('An error occurred'),
                        //     message: 'We were unable to get shipping rates because of a server error.',
                        //     duration: 0,
                        //     type: 'error'
                        // });
                    });
            },


            doCheckout: function(nonce) {
                return shoppingCartService.checkout({
                    nonce: nonce,
                    ...this.cartBillingAttributes
                })
                .then((result) => {
                    this.$store.dispatch('CART_DELETE');

                    this.braintree.hostedFieldsInstance.teardown((teardownErr) => {
                        if (teardownErr) {
                            console.log('There was an error tearing it down!', teardownErr.message);
                            shoppingCartService.getBraintreeErrorMessage(teardownErr, this);
                        }
                    });

                    return this.$router.push({ 
                        name: 'order',
                        params: { 
                            id: result.transactionId
                        } 
                    });
                })
                .catch((error) => {
                    currentNotification = this.$notify({
                        type: 'error',
                        title: `${ this.$t('Error placing order') }:`,
                        message: api.getApiErrorMessage(error),
                        duration: 0
                    });
                })
            },


            getPaymentMonthYearClass: shoppingCartService.getPaymentMonthYearClass,


            tokenizeHostedFields() {
                this.placeOrderButtonLoading = true;
                this.braintree.hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
                    if (tokenizeErr) {
                        currentNotification = this.$notify({
                            type: 'error',
                            title: this.$t('Payment method error') + ':',
                            message: shoppingCartService.getBraintreeErrorMessage.call(this, tokenizeErr),
                            duration: 0
                        });

                        this.placeOrderButtonLoading = false;
                        return;
                    }

                    this.doCheckout(payload.nonce).finally(() => {
                        this.placeOrderButtonLoading = false;
                    });
                });
            },


            tokenizePaypal() {
                this.placeOrderPaypalButtonLoading = true;
                this.braintree.paypalInstance.tokenize({flow: 'vault'}, (tokenizeErr, payload) => {
                    this.placeOrderButtonLoading = false;

                    if (tokenizeErr) {
                        if(tokenizeErr.code === 'PAYPAL_POPUP_CLOSED') {
                            this.paymentMethod = 'CREDIT_CARD'
                        }

                        currentNotification = this.$notify({
                            type: 'error',
                            title: this.$t('Payment method error') + ':',
                            message: shoppingCartService.getBraintreeErrorMessage.call(this, tokenizeErr) || $t('There was an error tokenizing PayPal!'),
                            duration: 0
                        });

                        this.placeOrderPaypalButtonLoading = false;
                        return;
                    }

                    this.doCheckout(payload.nonce).finally(() => {
                        this.placeOrderButtonLoading = false;
                    });
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
                            // hostedFieldsInstance.setPlaceholder('cvv', '••••');
                            this.securityCodeHint = `4 ${this.$tc('digits_text', 4)}`;
                        }

                        if(!isPotentiallyValid) {
                            this.cardType = event.cards[0].type;
                        }
                    }
                    else {
                        // hostedFieldsInstance.setPlaceholder('cvv', '•••');
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
                            selector: '#card-number'
                            // placeholder: '•••• •••• •••• ••••'
                        },
                        cvv: {
                            selector: '#cvv'
                            // placeholder: '•••'
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
                        currentNotification = this.$notify({
                            type: 'error',
                            title: this.$t('Payment method error') + ':',
                            message: shoppingCartService.getBraintreeErrorMessage(hostedFieldsErr, this),
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
                            currentNotification = this.$notify({
                                type: 'error',
                                title: this.$t('There was an error setting up the payment input fields!'),
                                message: shoppingCartService.getBraintreeErrorMessage(createPaypalErr),
                                duration: 0
                            });
                            return;
                        }

                        this.braintree.paypalInstance = paypalInstance;
                    }
                );
            },

            getClientToken: function() {
                return new Promise((resolve, reject) => {
                    if(!this.$store.state.app.braintreeClientToken) {
                        shoppingCartService.getBraintreeClientToken().then((token) => {
                            this.$store.dispatch('BRAINTREE_CLIENT_TOKEN', token);
                            resolve(token);       
                        });
                    }
                    else {
                        resolve(this.$store.state.app.braintreeClientToken);  
                    }
                });
            }
        },

        created() {
            if(this.cart.num_items) {
                this.getClientToken().then((token) => {
                    let client = require('braintree-web/client');
                    client
                        .create({ authorization: token })
                        .then((clientInstance) => {
                            this.createHostedFields(clientInstance);
                            this.createPaypal(clientInstance);
                        })
                        .catch((clientErr) => {
                            currentNotification = this.$notify({
                                type: 'error',
                                title: this.$t('There was an error setting up the payment client!'),
                                message: shoppingCartService.getBraintreeErrorMessage(clientErr, this),
                                duration: 0
                            });
                        })
                });
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>


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
                <div v-show="currentStep === 0">
                    <div class="step-title">{{ $t('Shipping address') }}:</div>
                    <shipping-billing-form type="shipping" @valid="val => { shippingButtonEnabled = val }"></shipping-billing-form>

                    <div class="ptl displayTable" style="margin:0 auto">
                        <shipping-billing-help></shipping-billing-help>
                    </div>

                    <div class="ptl tac">
                        <div class="inlineBlock">
                            <el-button type="warning"
                                        class="colorBlack"
                                        size="large"
                                        @click="submitShippingForm"
                                        :disabled="!shippingButtonEnabled"
                                        :loading="shippingFormIsLoading">{{ $t('CONTINUE') }}</el-button>

                            <bottom-popover width="200px"
                                            v-show="!shippingButtonEnabled" >{{ $t('fill_out_form_warning') }}</bottom-popover>
                        </div>
                    </div>
                </div>

                <!-- Payment -->
                <div v-show="currentStep === 1">
                    <div class="step-title">{{ $t('Choose a payment method') }}:</div>
                    <payment-method-chooser @change="val => { paymentMethod = val }"></payment-method-chooser>

                    <div v-show="paymentMethod === 'CREDIT_CARD'" class="mtl">
                        <div class="displayTable widthAll">
                            <!-- Card Number -->
                            <div class="displayTableRow">
                                <label class="checkout_form_label fwb">{{ $t('CARD NUMBER') }}:</label>
                                <div class="checkout_form_value">
                                    <div id="card-number" class="el-input__inner "></div>
                                    <span class="card-icon">
                                        <credit-card-icon :card-type="cardType"></credit-card-icon>
                                    </span>
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
                        <div class="inlineBlock">
                            <el-button type="warning"
                                class="colorBlack"
                                size="large"
                                @click="submitPaymentForm"
                                :disabled="!paymentMethodButtonEnabled"
                                slot="reference">{{ $t('CONTINUE') }}</el-button>

                            <bottom-popover width="200px"
                                            v-show="!paymentMethodButtonEnabled" >{{ $t('fill_out_form_warning') }}</bottom-popover>
                        </div>
                    </div>
                </div>

                <!-- Review -->
                <div v-show="currentStep === 2">
                    <div class="step-title">{{ $t('Place your order') }}:</div>
                    <cart-items :allow-edit="false"></cart-items>

                    <div class="mtm clearfix">
                        <div class="floatRight">
                            <cart-totals-table :cart="cart"
                                               :show-shipping-cost="true"
                                               :show-sales-tax="true"></cart-totals-table>
                        </div>
                    </div>

                    <!-- Submit button -->
                    <div class="pal tac">
                        <el-button v-show="paymentMethod !== 'PAYPAL'"
                                    type="warning"
                                    class="colorBlack"
                                    size="large"
                                    @click="tokenizeHostedFields"
                                    :loading="placeOrderButtonLoading"
                                    :disabled="!checkoutButtonEnabled">{{ $t('PLACE YOUR ORDER') }}</el-button>

                        <el-button v-show="paymentMethod === 'PAYPAL'"
                                    type="warning"
                                    class="colorBlack"
                                    size="large"
                                    @click="tokenizePaypal"
                                    :loading="placeOrderPaypalButtonLoading"
                                    :disabled="!checkoutButtonEnabled">{{ $t('Pay with PAYPAL') }}</el-button>
                    </div>
                </div>

                <!-- CVV Modal -->
                <el-dialog :title="$t('Finding your security code')" 
                        :modal-append-to-body="false"
                        :visible.sync="securityCodeModalShow">
                    <div class="cvvCard">
                        <div class="cvvCardPic">
                            <img src="/static/images/creditcards/card_back_cvv_4.png">
                        </div>
                        <div class="cvvCardContent">
                            <div class="fwb">{{ $t('American Express') }}</div>
                            <div>{{ $t('cvv_help_4_digit') }}</div>
                        </div>
                    </div>

                    <div class="cvvCard">
                        <div class="cvvCardPic">
                            <img src="/static/images/creditcards/card_back_cvv_3.png">
                        </div>
                        <div class="cvvCardContent">
                            <div class="fwb">{{ $t('All other cards') }}</div>
                            <div>{{ $t('cvv_help_3_digit') }}</div>
                        </div>
                    </div>
                </el-dialog>
            </template>

        </section>
    </div>
</template>


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

    .cvvCard {
        width: 100%;
        margin-bottom: 30px;
    }
    .cvvCardPic {
        display: block;
        width: auto;
    }
    .cvvCardContent {
        display: block;
        padding: 3px 0 0;
        font-size: 12px;
    }

    @media #{$medium-and-up} {
        .cvvCardPic {
            display: table-cell;
            width: 150px;
        }
        .cvvCardContent {
            display: table-cell;
            vertical-align: top;
            padding-left: 20px;
            font-size: 14px;
        }
    }
</style>
