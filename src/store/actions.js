import api from '../util/api';

export default {
    JWT_KEY: ({commit}, key) => {
        commit('JWT_KEY', key)
    },

    APP_INFO: ({ commit }, data) => {
        commit('APP_INFO', data);
    },

    GET_ALL_PRODUCTS: ({ commit }) => {
        api.getProducts(products => {
            commit('receiveProducts', { products });
        })
    },

    TOGGLE_SIDEBAR: ({ commit }, opened) => {
        commit('TOGGLE_SIDEBAR', opened);
    },

    TOGGLE_DEVICE: ({ commit }, device) => {
        commit('TOGGLE_DEVICE', device)
    },

    ADD_ITEM_TO_CART: ({ commit }, data) => {
        api.shoppingCart.addItem(data).then((cartData) => {
            commit('ADD_ITEM_TO_CART', cartData);
        })
    }
}
