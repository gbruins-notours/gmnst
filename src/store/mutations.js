import cloneDeep from 'lodash.clonedeep';


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
    APP_INFO: (state, data) => {
        state.appInfo = decorateAppInfo(data);
    },

    JWT_KEY: (state, key) => {
        state.jwtKey = key
    },

    receiveProducts (state, { products }) {
        state.allProducts = products
    },

    // ADD_ITEM_TO_CART: (state, cartData) => {
        // state.lastCheckout = null;
        // const record = state.added.find(p => p.id === id);
        // if (!record) {
        //     state.added.push({
        //         id,
        //         quantity: qty || 1
        //     })
        // }
        // else {
        //     record.quantity++
        // }
    // },

    CART_SET: (state, cartData) => {
        state.cart = cartData;
    },

    TOGGLE_SIDEBAR: (state, opened) => {
        state.app.sidebar.opened = opened
    },

    TOGGLE_DEVICE: (state, device) => {
        state.app.device.isMobile = device === 'mobile';
        state.app.device.isTablet = device === 'tablet';
    }
}

