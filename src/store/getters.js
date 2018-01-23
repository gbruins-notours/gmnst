export default {
    app: (state) => {
        return state.app;
    },

    inCheckoutFlow: (state) => {
        return state.app.header.inCheckoutFlow;
    },

    sidebar: (state) => {
        return state.app.sidebar;
    },

    braintreeClientToken: (state) => {
        return state.app.braintreeClientToken;
    }
}
