export default {
    APP_INFO: (state, data) => {
        state.appInfo = data;
    },

    JWT_KEY: (state, key) => {
        state.jwtKey = key
    },

    receiveProducts (state, { products }) {
        state.allProducts = products
    },

    ADD_TO_CART: (state, { id, qty }) => {
        state.lastCheckout = null;
        const record = state.added.find(p => p.id === id);
        if (!record) {
            state.added.push({
                id,
                quantity: qty || 1
            })
        }
        else {
            record.quantity++
        }
    },

    TOGGLE_SIDEBAR: (state, opened) => {
        state.app.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.app.device.isMobile = device === 'mobile';
        state.app.device.isTablet = device === 'tablet';
    }
}

