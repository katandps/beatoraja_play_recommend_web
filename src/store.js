import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        key: 'vue-gauth',
        paths: ['userInfo', 'accessToken', 'filter'],
        storage: window.sessionStorage
    })],
    state: {
        userInfo: null,
        accessToken: null,
        filter: null,
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        setAccessToken(state, token) {
            state.accessToken = token
        },
        setFilter(state ,filter) {
            state.filter = filter
        }
    },
    actions: {},
    getters: {
        userInfo(state) {
            return state.userInfo;
        },
        accessToken(state) {
            return state.accessToken;
        },
        filter(state) {
            return state.filter
        }
    }
})