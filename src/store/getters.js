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

    cart: (state) => {
        return state.cart;
    },

    numCartItems: (state) => {
        return state.cart.num_items || 0;
    }
}
