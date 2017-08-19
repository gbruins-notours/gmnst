import cloneDeep from 'lodash.clonedeep'
import isObject from 'lodash.isobject'


/**
 * Adds a little bit of decoration to the state for use in the UI
 * @param data
 */
function decorateAppInfo(data) {
    let appInfo = cloneDeep(data);

    if (appInfo && appInfo.hasOwnProperty('product')) {
        let seoUri = {};

        if (appInfo.product.subTypes) {
            Object.keys(appInfo.product.subTypes).forEach((subType) => {
                let val = subType.replace('PRODUCT_SUBTYPE_', '').toLowerCase();

                // pluralize the value if it doesn't already end in an 's'
                seoUri[subType] = val.indexOf(val.length - 1) !== 's' ? val + 's' : val;
            });
        }

        appInfo.seoUri = seoUri;
    }

    console.log('appInfo', appInfo);

    return appInfo;
}


export default {
    TOGGLE_SIDEBAR: (state, opened) => {
        state.app.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.app.device.isMobile = device === 'mobile';
        state.app.device.isTablet = device === 'tablet';
    },

    APP_INFO: (state, data) => {
        state.appInfo = decorateAppInfo(data);
    },

    JWT_KEY: (state, key) => {
        state.jwtKey = key
    },

    IN_CHECKOUT_FLOW: (state, inCheckoutFlow) => {
        state.app.pageHeader.inCheckoutFlow = inCheckoutFlow
    },

    receiveProducts (state, { products }) {
        state.allProducts = products
    },

    CART_SET: (state, cartData) => {
        state.cart = cartData;
    },

    /**
     * Updates an attribute in the checkout.shipping Object
     */
    CHECKOUT_SHIPPING_ATTRIBUTE: (state, config) => {
        state.checkout.shipping[config.attribute] = config.value;
    },

    /**
     * Updates an attribute in the checkout.shipping Object
     */
    CHECKOUT_BILLING_ATTRIBUTE: (state, config) => {
        state.checkout.billing[config.attribute] = config.value;
    },

    CHECKOUT_BILLING_SAME_AS_SHIPPING: (state, sameAsShipping) => {
        state.checkout.billingSameAsShipping = sameAsShipping;
    },

    CHECKOUT_SHIPPING_METHODS: (state, data) => {
        state.checkout.shippingMethods = data;
    },

    CHECKOUT_SALES_TAX: (state, salesTax) => {
        state.checkout.salesTax = salesTax;
    }
}
