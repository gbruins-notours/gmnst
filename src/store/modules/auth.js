import auth0 from 'auth0-js'
import Promise from 'bluebird'
import UtilityService from '@/utility_service'

const utilService = new UtilityService()
const redirectUri = utilService.getSiteUrl(true)

const WebAuth = new auth0.WebAuth({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: `${redirectUri}/callback`,
    audience: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid'
});


const state = {
    userInfo: null,
    access_token: null,
    id_token: null,
    expires_at: null,
    user_profile: null
}
  
const mutations = {
    LOGIN (state, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            state.access_token = authResult.accessToken;
            state.id_token = authResult.idToken;
            state.expires_at = authResult.expiresIn * 1000 + new Date().getTime();
        }
    },

    LOGOUT (state) {
        state.access_token = null;
        state.id_token = null;
        state.expires_at = null;
        // state.user_profile = null;
    }
}
  
const actions = {
    LOGOUT ({ commit }) {
        commit('LOGOUT')
    },

    LOGIN ({ commit }) {
        WebAuth.authorize();
    },

    SET_SESSION ({ commit }, authResult) {
        commit('LOGIN', authResult)
    },

    HANDLE_AUTHENTICATION ({ commit }) {
        return new Promise((resolve, reject) => {
            WebAuth.parseHash((err, authResult) => {
                if (err) {
                    return reject(new Error(err));
                }

                if (authResult && authResult.accessToken && authResult.idToken) {
                    commit('LOGIN', authResult)
                    return resolve();
                } 
            });
        });
    }
}
  
const getters = {
    /**
     * Checks whether the current time is past the access token's expiry time
     */
    isAuthenticated: state => {
        return new Date().getTime() < state.expires_at
    }
}
  
export default {
    state,
    mutations,
    getters,
    actions
}