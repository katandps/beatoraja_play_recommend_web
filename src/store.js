import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        key: 'vue-gauth',
        paths: ['userInfo', 'accessToken'],
        storage: window.sessionStorage
    })],
    state: {
        userInfo: null,
        accessToken: null,
    },
    mutations: {
        setUserInfo: function (state, userInfo) {
            state.userInfo = userInfo
        },
        setAccessToken: function (state, token) {
            state.accessToken = token
        }
    },
    actions: {},
    getters: {
        userInfo: state => {
            return state.userInfo;
        },
        accessToken: state => {
            return state.accessToken;
        }
    }
})