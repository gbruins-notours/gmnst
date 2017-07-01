export default {
    jwtKey: (state) => {
        return state.jwtKey;
    },

    appInfo: (state) => {
        return state.appInfo;
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
