export default {
    jwtKey: (state) => {
        return state.jwtKey
    },

    appInfo: (state) => {
        return state.appInfo
    },

    sidebar: (state) => {
        return state.app.sidebar
    },

    cart: (state) => {
        return state.cart;
    },

    numCartItems: (state) => {
        return state.cart.num_items || 0;
    }
}

