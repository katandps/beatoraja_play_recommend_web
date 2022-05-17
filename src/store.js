import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SongFilter from "./models/songFilter"

export const store = createStore({
    plugins: [createPersistedState({
        key: 'vue-gauth',
        paths: ['userInfo', 'accessToken', 'filter'],
        storage: window.localStorage
    })],
    state: {
        userInfo: null,
        accessToken: null,
        filter: new SongFilter(),
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
        },
        setVisibleAllLevelsFlag(state, flag) {
            state.filter.visible_all_levels = flag
        },
        setSort(state, column_name) {
            state.filter.set_sort(column_name)
        },
        setColumns(state, columns) {
            state.filter.set_columns(columns)
        },
        setLength(state, length) {
            state.filter.max_length = length
        }
    },
    actions: {},
    getters: {
        userInfo(state) {
            return state.userInfo
        },
        accessToken(state) {
            return state.accessToken
        },
        filter(state) {
            return state.filter
        },
        column_is_active: (state) => (column_name) => {
            return state.filter.columns[column_name]
        }
    }
})