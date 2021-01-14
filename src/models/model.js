import SongFilter from "./songFilter"
import Tables from "./table"
import Scores from "./song"
import {DateFormatter} from "./date_formatter"
import SongDetail from "./song_detail"
import config from "../const"

export default class Model {
    /**
     * @constructor
     * @public
     */
    constructor() {
        /**
         * @private
         * @type {SongFilter}
         */
        this.filter = new SongFilter()

        /**
         * @private
         * @type {Tables}
         */
        this.tables = null
        /**
         * @private
         * @type {Table}
         */
        this.selected_table = null
        /**
         * @private
         * @type {Scores}
         */
        this.songs = null
        /**
         * @private
         * @type {Date}
         */
        this.date = Model.default_date()
    }

    /**
     * @private
     * @return Date
     */
    static default_date() {
        return new Date(new Date().setHours(0, 0, 0, 0))
    }

    /**
     * @public
     * @returns {Model}
     */
    static default() {
        return new Model()
    }

    /**
     * @public
     * @param {string} token
     * @returns {self}
     */
    async init_table(token) {
        let model = this
        model.tables = await Tables.init(token)
        model.selected_table = model.tables ? model.tables.first() : null
        return model
    }

    /**
     * @public
     * @param token  APIアクセスに使用するトークン
     * @returns {Model}
     */
    async init_my_score(token) {
        return this.init_score(await Scores.init(DateFormatter.format(this.date), token))
    }

    /**
     * @public
     * @param {string} token  APIアクセスに使用するトークン
     * @param {number} user_id スコアを取得するユーザーID
     * @returns {Model}
     */
    async init_others_score(token, user_id) {
        return this.init_score(await Scores.init_others(DateFormatter.format(this.date), user_id, token))
    }

    /**
     * @private
     * @param {Scores} songs
     * @return {Model}
     */
    init_score(songs) {
        let model = this
        model.songs = songs
        return model
    }

    /**
     * @public
     * @returns {boolean}
     */
    song_is_set() {
        return !!this.songs
    }

    is_initialized() {
        return this.tables_is_set() && this.song_is_set()
    }

    /**
     * @public
     * @param {string} level
     * @param {string} lamp_type
     * @return {SongDetail[]}
     */
    get_lamp_list(level, lamp_type) {
        if (!this.song_is_set() || !this.tables_is_set()) {
            return []
        }
        let songs = this.songs.apply_table(this.get_selected_table(), this.filter)
        return songs.filter(s => s.clear_type === lamp_type && s.level === level).sort(s => s.title)
    }

    /**
     * @public
     * @param {string} level
     * @param {string} rank_type
     * @return {SongDetail[]}
     */
    get_rank_list(level, rank_type) {
        if (!this.song_is_set() || !this.tables_is_set()) {
            return []
        }
        let songs = this.songs.apply_table(this.get_selected_table(), this.filter)
        return songs.filter(s => s.clear_rank === rank_type && s.level === level).sort(s => s.title)
    }


    /**
     * @public
     * @param {string} selected_level
     * @returns {SongDetail[]}
     */
    get_sorted_song_list(selected_level) {
        if (!this.song_is_set() || !this.tables_is_set()) {
            return [SongDetail.dummy()]
        }
        let songs = this.songs.apply_table(this.get_selected_table(), this.filter)
        if (!this.filter.visible_all_levels) {
            songs = songs.filter(s => s.level === selected_level)
        }
        const length = parseInt(this.filter.max_length) > 0 ? this.filter.max_length : songs.length;
        return songs.sort(this.cmp.bind(this)).slice(0, length)
    }

    /**
     * @private
     * @param {SongDetail} a
     * @param {SongDetail} b
     * @returns {number}
     */
    cmp(a, b) {
        let valA = a.sort_key(this.filter.sort_key, this.get_selected_table().level_list)
        let valB = b.sort_key(this.filter.sort_key, this.get_selected_table().level_list)
        return valA === valB ? 0 : ((valA < valB) ^ this.filter.sort_desc) ? -1 : 1
    }

    /**
     * @returns {({name: string, title: string, class: string, key: string})[]}
     */
    get_active_columns() {
        return config.DETAIL_COLUMNS.filter(obj => this.filter.columns[obj.key])
    }

    /**
     * @public
     * @returns {boolean}
     */
    tables_is_set() {
        return !!this.tables
    }

    /**
     * @public
     * @returns {string}
     */
    user_name() {
        return this.songs ? this.songs.name : ""
    }

    /**
     * @public
     * @returns {string[]}
     */
    get_table_names() {
        return this.tables ? this.tables.name_list() : []
    }

    /**
     * @public
     * @returns {Table}
     */
    get_selected_table() {
        return this.selected_table
    }

    /**
     * @public
     * @returns {string|null}
     */
    get_selected_table_name() {
        return this.selected_table ? this.selected_table.name : ""
    }

    /**
     * @public
     * @param {string} table_name 設定するテーブル名
     * @return Model
     */
    set_table(table_name) {
        let model = this
        model.selected_table = this.tables ? this.tables.get_table(table_name) : null

        return model
    }

    /**
     * @public
     * @param {Date} date
     * @return Model
     */
    set_date(date) {
        let model = this
        model.date = date
        return model
    }

    /**
     * @public
     * @returns {string}
     */
    get_twitter_link() {
        return "https://twitter.com/intent/tweet?url="
            + window.location.host + "/%23/view?user_id=" + this.songs.user_id
    }

    /**
     * @param {string} key
     * @return {boolean}
     */
    sort_key_is(key) {
        return this.filter.sort_key === key
    }
}
