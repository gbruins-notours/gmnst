<template>
    <div>

    </div>
</template>


<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import isObject from 'lodash.isobject'
    import { Dialog, RadioGroup, Radio } from 'element-ui'

    Vue.use(Dialog)
    Vue.use(RadioGroup)
    Vue.use(Radio)

    export default {
        computed: {
            ...mapGetters([
                'appInfo'
            ]),

            checkoutButtonEnabled: function() {
                return (this.paymentMethod === 'CREDIT_CARD');
            }
        },

        // components: {
        // },

        data() {
            return {
                paymentMethod: 'CREDIT_CARD',
                cvvModalIsActive: false,
                inputClasses: {
                    'card-number': null,
                    'expiration-date': null,
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
            paymentMethodChanged: function() {
                if(this.paymentMethod === 'PAYPAL') {
                    this.paypalTransaction();
                }

                this.$emit('payment_method_changed', this.paymentMethod)
            },

            setPaymentMethod: function(paymentMethod) {
                this.paymentMethod = paymentMethod;
                this.paymentMethodChanged()
            },

            createBraintree: function() {
                let client = require('braintree-web/client');

                client.create({
                    authorization: this.appInfo.clientToken
                }, (clientErr, clientInstance) => {
                    if (clientErr) {
                        this.$emit('braintree_client_create_failure', clientErr.message)
                    }
                    else {
                      this.braintree.clientInstance = clientInstance
                      this.createHostedFields();
                      this.createPaypal();
                      this.$emit('braintree_client_create_success')
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
                        this.$emit('braintree_hosted_fields_create_failed', hostedFieldsErr.message)
                        return;
                    }
                    else {
                        this.braintree.hostedFieldsInstance = hostedFieldsInstance;
                        this.setHostedFieldsEventHandlers(hostedFieldsInstance);
                        this.$emit('braintree_hosted_fields_create_success', hostedFieldsInstance)
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

                    // Change card bg depending on card type
                    if (event.cards.length === 1) {
                        // Change the CVV length for AmericanExpress cards
                        if (event.cards[0].code.size === 4) {
                            hostedFieldsInstance.setPlaceholder('cvv', '••••');
                        }

                        if(angular.isObject(event.fields)
                            && angular.isObject(event.fields.number)
                            && !event.fields.number.isPotentiallyValid) {
                            changeCreditCardImage('invalid');
                        }
                        else {
                            changeCreditCardImage(event.cards[0].type);
                        }
                    }
                    else {
                        hostedFieldsInstance.setPlaceholder('cvv', '123');

                        if(angular.isObject(event.fields)
                            && angular.isObject(event.fields.number)
                            && !event.fields.number.isEmpty) {
                            changeCreditCardImage('invalid');
                        }
                        else {
                            changeCreditCardImage();
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
                                this.setPaymentMethod('CREDIT_CARD')
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
                        console.log("PAYPAY NONCE", paypalPayload.paymentMethodNonce)
                    }
                });
            }
        },

        created() {
          this.createBraintree();

          // let the client know what the default payment method is:
          this.paymentMethodChanged();
        }
    }
</script>
