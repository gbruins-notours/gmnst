import isObject from 'lodash.isobject'
import api from './api'

export default {

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

    getBraintreeErrorMessage: function(clientErr, scope) {
        let errorMessage = clientErr;

        if(isObject(clientErr) && clientErr.hasOwnProperty('code')) {
            api.logger('error', clientErr.code);

            // https://github.com/braintree/braintree-web/blob/3beb6d43b1c453e3c97f01129fa07a89234b2003/src/hosted-fields/shared/errors.js
            // Not translating all errors, just the ones that could be caused by the user
            switch(clientErr.code) {
                case 'HOSTED_FIELDS_FIELDS_EMPTY':
                    errorMessage = scope.$t('braintree.HOSTED_FIELDS_FIELDS_EMPTY');
                    break;

                case 'HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED':
                    errorMessage = scope.$t('braintree.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED');
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

}