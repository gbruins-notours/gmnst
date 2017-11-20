export default {
    app: (state) => {
        return state.app;
    },

    inCheckoutFlow: (state) => {
        return state.app.pageHeader.inCheckoutFlow;
    },

    sidebar: (state) => {
        return state.app.sidebar;
    },

    braintreeClientToken: (state) => {
        return state.app.braintreeClientToken;
    },

    cart: (state) => {
        return state.cart;
    },

    numCartItems: (state) => {
        return state.cart.num_items || 0;
    },

    cartShippingAttributes: (state) => {
        let attrs = {};

        Object.keys(state.cart).forEach((key) => {
            if(key.indexOf('shipping_') === 0) {
                attrs[key] = state.cart[key]
            }
        });

        return attrs;
    },

    cartBillingAttributes: (state) => {
        let attrs = {};

        Object.keys(state.cart).forEach((key) => {
            if(key.indexOf('billing_') === 0) {
                attrs[key] = state.cart[key]
            }
        });
        
        return attrs;
    }
}
