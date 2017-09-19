import cloneDeep from 'lodash.clonedeep'
import forEach from 'lodash.foreach'

export default {
    TOGGLE_SIDEBAR: (state, opened) => {
        state.app.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.app.device.isMobile = device === 'mobile';
        state.app.device.isTablet = device === 'tablet';
    },

    // APP_INFO: (state, data) => {
    //     state.appInfo = decorateAppInfo(data);
    // },

    BRAINTREE_CLIENT_TOKEN: (state, token) => {
        state.app.clientToken = token
    },

    JWT_KEY: (state, key) => {
        state.app.jwtKey = key
    },

    PRODUCT_INFO: (state, data) => {
        let productInfo = cloneDeep(data);
        
        if (productInfo) {
            let seoUri = {};
    
            if (productInfo.subTypes) {
                Object.keys(productInfo.subTypes).forEach((subType) => {
                    let val = subType.replace('PRODUCT_SUBTYPE_', '').toLowerCase();
    
                    // pluralize the value if it doesn't already end in an 's'
                    seoUri[subType] = val.indexOf(val.length - 1) !== 's' ? val + 's' : val;
                });
            }
    
            productInfo.seoUri = seoUri;
        }
        state.app.productInfo = productInfo;
        console.log("PRODUCT INFO", state.app.productInfo);
    },

    IN_CHECKOUT_FLOW: (state, inCheckoutFlow) => {
        state.app.pageHeader.inCheckoutFlow = inCheckoutFlow
    },

    receiveProducts (state, { products }) {
        state.allProducts = products
    },

    CART_SET: (state, cartData) => {
        forEach(cartData, (val, key) => {
            state.cart[key] = val;   
        });
    },

    /**
     * Updates an attribute in the checkout.shipping Object
     */
    CART_BILLING_ATTRIBUTE: (state, config) => {
        state.cart[`billing_${config.attribute}`] = config.value;
    },

    CART_BILLING_SAME_AS_SHIPPING: (state, sameAsShipping) => {
        state.cart.billingSameAsShipping = sameAsShipping;
    },

    CART_SHIPPING_METHODS: (state, data) => {
        state.cart.shippingMethods = data;
    }
}
