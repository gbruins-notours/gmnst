const jwtKey = state => state.jwtKey;
const appInfo = state => state.appInfo;
const sidebar = state => state.app.sidebar;


export default {
    jwtKey,
    appInfo,
    sidebar,
    numCartItems: (state) => {
        console.log("num items", state);
        return state.cart.num_items || 0;
    }
}

