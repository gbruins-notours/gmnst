<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import forEach from 'lodash.foreach'
    import cloneDeep from 'lodash.clonedeep'
    import Promise from 'bluebird';
    import { Checkbox, Input, Notification, Loading, Dialog, Select } from 'element-ui'
    import PaymentMethodChooser from '@/components/checkout/PaymentMethodChooser'
    import ShippingBillingForm from '@/components/checkout/ShippingBillingForm'
    import CartItems from '@/components/cart/CartItems'
    import CartTotalsTable from '@/components/cart/CartTotalsTable'
    import ShippingView from '@/components/checkout/ShippingView'
    import ShippingBillingHelp from '@/components/checkout/ShippingBillingHelp'
    import BottomPopover from '@/components/BottomPopover'
    import CreditCardIcon from '@/components/CreditCardIcon'
    import api from '@/util/api'
    import ShoppingCartService from '@/pages/cart/ShoppingCartService.js'
    import PageHeader from '@/components/PageHeader'
    import SiteName from '@/components/SiteName'

    let shoppingCartService = new ShoppingCartService();

    Vue.use(Checkbox)
    Vue.use(Input)
    Vue.use(Dialog)
    Vue.use(Select)

    Vue.prototype.$notify = Notification;

    let currentNotification = null;


    export default {
        components: {
            PageHeader,
            PaymentMethodChooser,
            ShippingView,
            ShippingBillingHelp,
            ShippingBillingForm,
            Checkbox,
            CartItems,
            BottomPopover,
            CreditCardIcon,
            CartTotalsTable,
            SiteName
        },

        computed: {
            ...mapGetters({
                shoppingCart: 'cart/cart',
                billingAttributes: 'cart/billingAttributes',
                braintreeClientToken: 'app/braintreeClientToken'
            }),

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
                    this.inputClasses['cvv'].indexOf('colorGreen') > -1) && 
                    (this.billingSameAsShipping || (!this.billingSameAsShipping && this.separateBillingFormValid))) {
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
                    return this.shoppingCart.billingSameAsShipping;
                },
                set: function(newVal) {
                    this.$store.dispatch('cart/ATTRIBUTE_SET', {
                        attribute: 'billingSameAsShipping',
                        value: newVal
                    });
                }
            }
        },

        data: function() {
            return {
                //test
                STEP_SHIPPING_ADDRESS: 0,
                STEP_SHIPPING_METHOD: 1,
                STEP_PLACE_ORDER: 2,
                shippingRates: null,
                paymentMethod: 'CREDIT_CARD',
                cardType: null,
                securityCodeModalShow: false,
                securityCodeHint: `3 ${this.$tc('digits_text', 3)}`,
                placeOrderButtonLoading: false,
                separateBillingFormValid: false,
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
            setBillingData: function() {
                return new Promise((resolve, reject) => {
                    if(this.shoppingCart.billingSameAsShipping) {
                        let shippingKeys = [
                            'firstName',
                            'lastName',
                            'streetAddress',
                            'extendedAddress',
                            'company',
                            'city',
                            'state',
                            'postalCode',
                            'countryCodeAlpha2'
                        ];

                        let cart = cloneDeep(this.shoppingCart);

                        shippingKeys.forEach((item) => {
                            cart[`billing_${item}`] = cart[`shipping_${item}`]
                        });

                        this.$store.dispatch('cart/CART_SET', cart).then(resolve);
                    }
                    else {
                        resolve();
                    }
                });
            },


            submitPaymentForm: function() {
                this.setBillingData().then(() => {
                    this.placeOrderButtonLoading = true;

                    if(this.paymentMethod === 'PAYPAL') {
                        this.tokenizePaypal();
                    }
                    else {
                        this.tokenizeHostedFields();
                    }
                });
            },


            doCheckout: function(nonce) {
                return shoppingCartService.checkout({
                    nonce: nonce,
                    ...this.billingAttributes
                })
                .then((result) => {
                    this.$store.dispatch('cart/CHECKOUT_CLEANUP');

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

                this.braintree.hostedFieldsInstance
                    .tokenize()
                    .then((payload) => {
                        this.doCheckout(payload.nonce).finally(() => {
                            this.placeOrderButtonLoading = false;
                        });
                    })
                    .catch((tokenizeErr) => {
                        currentNotification = this.$notify({
                            type: 'error',
                            title: this.$t('Payment method error') + ':',
                            message: shoppingCartService.getBraintreeErrorMessage.call(this, tokenizeErr),
                            duration: 0
                        });

                        this.placeOrderButtonLoading = false;
                    });
            },


            tokenizePaypal() {
                let loadingInstance = Loading.service({
                    lock: true,
                    fullscreen: true,
                    text: this.$t('PAYPAL_WINDOW_IS_OPEN'),
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                
                this.braintree.paypalInstance
                    .tokenize({flow: 'vault'}) 
                    .then((payload) => {
                        loadingInstance.setText(`${this.$t('Processing')}...`);
                        this.doCheckout(payload.nonce).finally(() => {
                            loadingInstance.close();
                        });
                    })
                    .catch((tokenizeErr) => {
                        loadingInstance.close();

                        // Not all error codes warrant a notification popup
                        if (tokenizeErr.code !== 'PAYPAL_POPUP_CLOSED') {
                            currentNotification = this.$notify({
                                type: 'error',
                                title: this.$t('Payment method error') + ':',
                                message: shoppingCartService.getBraintreeErrorMessage.call(this, tokenizeErr) || $t('There was an error tokenizing PayPal!'),
                                duration: 0
                            });
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
                    if(!this.braintreeClientToken) {
                        shoppingCartService.getBraintreeClientToken().then((token) => {
                            this.$store.dispatch('app/BRAINTREE_CLIENT_TOKEN', token);
                            resolve(token);
                        });
                    }
                    else {
                        resolve(this.braintreeClientToken);
                    }
                });
            }
        },

        created() {
            if(this.shoppingCart.num_items) {
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
        }
    }
</script>

<template>
    <div>
        <page-header :title="$t('Place your order') + ':'"></page-header>

        <div class="mtl">
            <div class="displayTable widthAll">
                <!-- Payment Method -->
                <div class="displayTableRow">
                    <label class="checkout_form_label fwb">{{ $t('PAYMENT METHOD') }}:</label>
                    <div class="checkout_form_value">
                        <!-- <payment-method-chooser @change="val => { paymentMethod = val }"></payment-method-chooser> -->
                        <div class="inlineBlock relative">
                            <el-select v-model="paymentMethod" placeholder="Select">
                                <el-option :label="$t('CREDIT CARD')" value="CREDIT_CARD">
                                    <span class="floatLeft">{{ $t('CREDIT CARD') }}</span>
                                    <span class="floatRight fs20"><i class="fa fa-credit-card payment-type vam"></i></span>
                                </el-option>
                                <el-option :label="$t('PAYPAL')" value="PAYPAL">
                                    <span class="floatLeft">{{ $t('PAYPAL') }}</span>
                                    <span class="floatRight fs20"><i class="fa fa-paypal payment-type vam"></i></span>
                                </el-option>
                            </el-select>
                            <i class="fa fa-check-circle colorGreen checkout_form_value_icon"></i>
                        </div>
                    </div>
                </div>

                <!-- Card Number -->
                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                    <label class="checkout_form_label fwb">{{ $t('CARD NUMBER') }}:</label>
                    <div class="checkout_form_value">
                        <div id="card-number" class="el-input__inner"></div>
                        <span class="card-icon">
                            <credit-card-icon :card-type="cardType"></credit-card-icon>
                        </span>
                        <i v-show="inputClasses['card-number']" 
                            :class="inputClasses['card-number']"
                            class="checkout_form_value_icon"></i>
                    </div>
                </div>

                <!-- Expiration -->
                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                    <label class="checkout_form_label fwb">{{ $t('EXPIRES') }}:</label>
                    <div class="checkout_form_value">
                        <div class="displayTable relative">
                            <!-- month -->
                            <div id="expiration-month" class="el-input__inner hostedField70 displayTableCell"></div>

                            <div class="displayTableCell colorGrayLighter phs vat" style="font-size:22px">/</div>

                            <!-- year -->
                            <div id="expiration-year" class="el-input__inner hostedField70 displayTableCell"></div>

                            <i v-show="inputClasses['expiration-month'] && inputClasses['expiration-year']"
                                :class="getPaymentMonthYearClass(inputClasses['expiration-month'], inputClasses['expiration-year'])"
                                class="checkout_form_value_icon"></i>
                        </div>
                    </div>
                </div>

                <!-- CVV -->
                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                    <label class="checkout_form_label">
                        <span class="fwb">{{ $t('SECURITY CODE') }}</span>:
                        <!-- <span class="colorGrayLighter">({{ securityCodeHint }})</span>: -->
                    </label>
                    <div class="checkout_form_value">
                        <div class="displayTableCell relative">
                            <div id="cvv" class="el-input__inner hostedField80 displayTableCell"></div>
                            <i v-show="inputClasses.cvv" 
                                :class="inputClasses.cvv"
                                class="checkout_form_value_icon"></i>
                            <!-- <div class="colorGrayLighter fs14">({{ securityCodeHint }})</div> -->
                        </div>
                        <div class="displayTableCell plm vat">
                            <span class="underlineDotted cursorPointer" @click="securityCodeModalShow = true">{{ $t("what's this?") }}</span>
                        </div>
                    </div>
                </div>

                <!-- Billing address -->
                <div class="displayTableRow" v-show="paymentMethod === 'CREDIT_CARD'">
                    <div class="checkout_form_label fwb">{{ $t('BILLING ADDRESS') }}:</div>
                    <div class="checkout_form_value">
                        <el-checkbox v-model="billingSameAsShipping">{{ $t('SAME AS SHIPPING ADDRESS') }}:</el-checkbox>

                        <div class="pll mts" v-show="billingSameAsShipping">
                            <shipping-view :show-details="true" :show-email="false"></shipping-view>
                        </div>
                        <shipping-billing-form type="billing"
                                            v-if="!billingSameAsShipping"
                                            @valid="val => { separateBillingFormValid = val }"
                                            class="mtl"></shipping-billing-form>
                    </div>
                </div>
            </div>

            <div class="shippingHelp" v-show="paymentMethod === 'CREDIT_CARD'">
                <shipping-billing-help></shipping-billing-help>
            </div>
        </div>

        <div class="ptl tac">
            <div class="inlineBlock">
                <cart-totals-table :cart="shoppingCart"
                                    :show-shipping-cost="true"
                                    :show-sales-tax="true"></cart-totals-table>
            </div>
        </div>

        <div class="ptl tac">
            <div class="inlineBlock">
                <el-button type="warning"
                            class="colorBlack"
                            size="large"
                            @click="submitPaymentForm"
                            :loading="placeOrderButtonLoading"
                            :disabled="!paymentMethodButtonEnabled">
                    <span v-show="paymentMethod === 'PAYPAL'">{{ $t('Pay with PAYPAL') }}</span>
                    <span v-show="paymentMethod !== 'PAYPAL'">{{ $t('PLACE YOUR ORDER') }}</span>
                </el-button>

                <bottom-popover width="200px"
                                v-show="!paymentMethodButtonEnabled" >{{ $t('fill_out_form_warning') }}</bottom-popover>
            </div>
        </div>

        <div class="fs12 mtl tac">
            <i18n path="accept_privacy_and_tos" tag="div">
                <span place="siteName"><site-name></site-name>'s</span>
                <span place="linkPrivacy"><router-link :to="{name: 'privacy'}">{{ $t('Privacy Notice') }}</router-link></span>
                <span place="linkTos"><router-link :to="{name: 'conditions_of_use'}">{{ $t('Conditions of Use') }}</router-link></span>
            </i18n>
        </div>

        <div class="ptl">
            <cart-items :allow-edit="false"></cart-items>
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

    </div>
</template>

<style lang="scss">
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .shippingHelp {
        padding: 10px;
        margin: 20px auto 0 auto;
        display: table;
        font-size: 14px;
        @include rounded();
        background-color: $bgGrayZebra;
        width: 100%;
        text-align: center;
    }

    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }

    .card-icon {
        position: absolute;
        top: 1px;
        right: 0px;

        img {
            width: 65px;
        }
    }

    .hostedField70 {
        min-width:70px !important;
        width:70px !important;
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