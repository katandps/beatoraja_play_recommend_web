import { debug } from 'loglevel'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { CheckedTables } from './models/difficultyTable'
import SongFilter from "./models/songFilter"

export const store = createStore({
    plugins: [createPersistedState({
        key: 'vue-gauth',
        paths: ['userInfo', 'accessToken', 'filter', 'checked_tables'],
        storage: window.localStorage
    })],
    state: {
        userInfo: null,
        accessToken: null,
        filter: new SongFilter(null),
        checked_tables: new CheckedTables(),
        userId: 1,
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        setAccessToken(state, token) {
            state.accessToken = token
        },
        setFilter(state, filter) {
            state.filter = filter
        },
        setSort(state, column_name) {
            state.filter.set_sort(column_name)
        },
        setColumns(state, columns) {
            state.filter.set_columns(columns)
        },
        setLength(state, length) {
            state.filter.max_length = length || 1
        },
        setScoreUserId(state, userId) {
            state.userId = userId
        },
        setCheckedTables(state, checks) {
            debug(checks)
            state.checked_tables = checks
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
        column_is_active: (state: any) => (column_name: string) => {
            return state.filter.columns_detail[column_name]
        },
        user_id(state): number {
            return state.userId
        },
        checked_tables(state): CheckedTables {
            return state.checked_tables
        }
    }
})