export default {
    INCREMENT: ({commit}) => {
        commit('INCREMENT')
    },

    DECREMENT: ({commit}) => {
        commit('DECREMENT')
    },

    JWT_KEY: ({commit}, key) => {
        commit('JWT_KEY', key)
    }
}
