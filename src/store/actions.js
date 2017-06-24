import api from '../util/api';


export default {
    JWT_KEY: ({ commit }) => {
        return api.getToken().then((response) => {
            commit('JWT_KEY', response.headers['x-authorization'])
        })
    },

    APP_INFO: ({ commit }) => {
        return api.getInfo().then((data) => {
            commit('APP_INFO', data);
        })
    },

    GET_ALL_PRODUCTS: ({ commit }) => {
        return api.getProducts(products => {
            commit('receiveProducts', { products });
        })
    },

    TOGGLE_SIDEBAR: ({ commit }, opened) => {
        commit('TOGGLE_SIDEBAR', opened);
    },

    TOGGLE_DEVICE: ({ commit }, device) => {
        commit('TOGGLE_DEVICE', device)
    },

    CART_ITEM_ADD: ({ commit }, data) => {
        return api.shoppingCart.addItem(data).then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_ITEM_SET_QTY: ({ commit }, data) => {
        return api.shoppingCart.updateItemQty(data).then((cartData) => {
            commit('CART_SET', cartData);
        })
    },

    CART_ITEM_DELETE: ({ commit }, data) => {
        return api.shoppingCart.deleteItem(data).then((cartData) => {
            commit('CART_SET', cartData);
        })  
    },

    CART_SYNC: ({ commit }, data) => {
        return api.shoppingCart.getCart().then((cartData) => {
            console.log("CART", cartData);
            commit('CART_SET', cartData);
        })
    }
}
