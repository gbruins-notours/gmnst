'use strict';

const state = {
    sidebarOpened: true,
    isMobile: false
}

const mutations = {
    CLOSE_SIDEBAR: (state) => {
        state.sidebarOpened = false
    },

    OPEN_SIDEBAR: (state) => {
        state.sidebarOpened = true
    },

    TOGGLE_SIDEBAR: (state) => {
        state.sidebarOpened = !state.sidebarOpened
    },
  
    LOCATION_CHANGE: (state) => {
        state.sidebarOpened = false
    },

    WINDOW_RESIZE: (state) => {
        const { innerWidth } = window
        const isDesktop = innerWidth > 1024
        state.isMobile = !isDesktop
        state.sidebarOpened = isDesktop
    }
}

const actions = {
    openSidebar ({ commit }) {
        commit('OPEN_SIDEBAR')
    },

    closeSidebar ({ commit }) {
        commit('CLOSE_SIDEBAR')
    },

    toggleSidebar ({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },

    windowResize ({ commit }) {
        commit('WINDOW_RESIZE')
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}