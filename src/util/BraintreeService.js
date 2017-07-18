import Promise from 'bluebird';

export default class BraintreeService {

    constructor() {
        this.client = require('braintree-web/client');
        this.clientInstance = null;
        this.hostedFieldsInstance = null;
        this.paypalInstance = null;
    }


    create(clientToken) {
        return new Promise((resolve, reject) => {
            this.client.create(
                { authorization: clientToken },
                (clientErr, clientInstance) => {
                    if (clientErr) {
                        return reject(clientErr)
                    }

                    this.clientInstance = clientInstance;
                    // this.createHostedFields(clientInstance);
                    // this.createPaypal(clientInstance);
                }
            );
        });
    }


    createHostedFields(fieldsObj) {
        return new Promise((resolve, reject) => {
            let hostedFields = require('braintree-web/hosted-fields');

            hostedFields.create({
                client: this.clientInstance,
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
                fields: fieldsObj
            }, (hostedFieldsErr, hostedFieldsInstance) => {
                if (hostedFieldsErr) {
                    return reject(hostedFieldsErr)
                }
                else {
                    this.hostedFieldsInstance = hostedFieldsInstance;
                    return resolve(hostedFieldsInstance)
                    // this.setHostedFieldsEventHandlers(hostedFieldsInstance);
                }
            });
        });
    }


    createPaypal(clientInstance) {
        return new Promise((resolve, reject) => {
            let paypal = require('braintree-web/paypal');

            paypal.create(
                { client: this.clientInstance },
                (createPaypalErr, paypalInstance) => {
                    if (createPaypalErr) {
                        return reject(createPaypalErr);
                    }

                    this.paypalInstance = paypalInstance;
                }
            );
        });
    }


    getHostedFieldsInstance() {
        return this.hostedFieldsInstance;
    }


    tokenizeHostedFields() {
        return this.hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
                console.log("TOKENIZED ERROR", tokenizeErr);
                throw new Error(tokenizeErr);
            }

            return payload;
        });
    }


    tokenizePaypal() {
        return this.paypalInstance.tokenize(
            { flow: 'vault' },
            (pptokenizeErr, paypalPayload) => {
                if (pptokenizeErr) {
                    throw new Error(pptokenizeErr);
                }
                else {
                    return {
                        nonce: paypalPayload.paymentMethodNonce,
                        payload: paypalPayload
                    }
                }
            }
        );
    }

}
