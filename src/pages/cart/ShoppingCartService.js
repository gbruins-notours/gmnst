'use strict';

import isObject from 'lodash.isobject'
import { getHttp } from '../../util/http-common';
import api from '../../util/api'

export default class ShoppingCartService {
    // constructor() {
    // }

    getBraintreeClientToken() {
        return getHttp()
            .get('/api/v1/cart/token/get')
            .then((response) => {
                return response.data.data;
            });
    }

    getCart() {
        return getHttp()
            .get('/api/v1/cart/get')
            .then((response) => {
                return response.data.data;
            });
    }

    addItem(params) {
        return getHttp()
            .post('/api/v1/cart/item/add', params)
            .then((response) => {
                return response.data.data;
            });
    }

    updateItemQty(params) {
        return getHttp()
            .post('/api/v1/cart/item/qty', params)
            .then((response) => {
                return response.data.data;
            });
    }

    deleteItem(params) {
        return getHttp()
            .post('/api/v1/cart/item/remove', params)
            .then((response) => {
                return response.data.data;
            });
    }

    setShippingAddress(address) {
        return getHttp()
            .post('/api/v1/cart/shipping/setaddress', address)
            .then((response) => {
                return response.data.data;
            });
    }

    validateAddress(address) {
        return getHttp()
            .post('/api/v1/shipping/validateAddress', address)
            .then((response) => {
                return response.data.data;
            });
    }

    getShippingRates(params) {
        return getHttp()
            .post('/api/v1/shipping/rates', params)
            .then((response) => {
                return response.data.data;
            });
    }

    setShippingRate(obj) {
        return getHttp()
            .post('/api/v1/cart/shipping/rate', {
                shipping_rate: obj
            })
            .then((response) => {
                return response.data.data;
            });
    }

    checkout(params) {
        return getHttp()
            .post('/api/v1/cart/checkout', params)
            .then((response) => {
                return response.data.data;
            });
    }

    getPaymentMonthYearClass(monthClasses, yearClasses) {
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
    }

    getBraintreeErrorMessage(clientErr) {
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

                case 'PAYPAL_POPUP_CLOSED':
                    // console.error('Customer closed PayPal popup.');
                    this.paymentMethod = 'CREDIT_CARD'
                    break;

                case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
                case 'PAYPAL_FLOW_FAILED':
                    errorMessage = clientErr.details
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
    }


    getFormattedShippingName(firstName, lastName) {
        let val = [];

        if(firstName) {
            val.push(firstName);
        }

        if(lastName) {
            val.push(lastName);
        }

        return val.join(' ');
    }


    getFormattedCityStateZip(city, state, postalCode) {
        let val = [];

        if(city) {
            val.push(city)
        }

        if(state || postalCode) {
            val.push(',');

            if(state) {
                val.push(' ' + state);
            }

            if(postalCode) {
                val.push(' ' + postalCode);
            }
        }

        return val.join('');
    }


    getFormattedCompanyName(name) {
        if(name) {
            return name.toUpperCase()
        }
        return null;
    }


    getCartDefaults() {
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
            num_items: 0,
            product_weight_total: 0,
            sub_total: null,
            shipping_total: null,
            shipping_rate: null,
            sales_tax: null,
            grand_total: null
        }
    }

}