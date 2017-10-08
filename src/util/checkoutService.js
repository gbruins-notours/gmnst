import isObject from 'lodash.isobject'
import api from './api'

export default {

    getPaymentMonthYearClass: function(monthClasses, yearClasses) {
        if(Array.isArray(monthClasses) && Array.isArray(yearClasses)) {
            if(monthClasses[1] === yearClasses[1]) {
                return monthClasses;
            }
            // find which set has the error classes and return those;
            else if(monthClasses[1] === 'fa-times-circle') {
                return monthClasses;
            }
            else {
                return yearClasses;
            }
        }
    },

    copyShippingStateToBillingState: (cart) => {
        let shippingKeys = [
            'firstName',
            'lastName',
            'streetAddress',
            'extendedAddress',
            'company',
            'city',
            'state',
            'postalCode',
            'countryCodeAlpha2',
            'email'
        ];

        shippingKeys.forEach((item) => {
            let billing_key = `billing_${item}`;
            let shipping_key = `shipping_${item}`;

            if(item !== 'email') {
                cart[billing_key] = cart[shipping_key]
            }  
        })
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

    getCartDefaults: () => {
        return {
            billingSameAsShipping: true,
            shipping_firstName: null,
            shipping_lastName: null,
            shipping_streetAddress: null,
            shipping_extendedAddress: null,
            shipping_company: null,
            shipping_city: null,
            shipping_state: null,
            shipping_postalCode: null,
            shipping_countryCodeAlpha2: null,
            shipping_email: null,
            billing_firstName: null,
            billing_lastName: null,
            billing_company: null,
            billing_streetAddress: null,
            billing_extendedAddress: null,
            billing_city: null,
            billing_state: null,
            billing_postalCode: null,
            billing_countryCodeAlpha2: null,
            billing_phone: null,
            num_items: 0
        }
    }

}