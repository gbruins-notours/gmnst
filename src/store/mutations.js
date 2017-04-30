export default {
    INCREMENT: (state) => {
        state.count += 1
    },

    DECREMENT: (state) => {
        state.count -= 1
    },

    JWT_KEY: (state, key) => {
        state.jwtKey = key
    }
}
