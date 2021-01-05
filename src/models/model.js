import Filter from "./filter";
import Tables from "./table";
import AllDetail from "./song"
import {DateFormatter} from "./date_formatter";
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
         * @type {Filter}
         */
        this.filter = new Filter()

        /**
         * @private
         * @type {Tables}
         */
        this.tables = null;
        /**
         * @private
         * @type {Table}
         */
        this.selected_table = null;
        /**
         * @private
         * @type {AllDetail}
         */
        this.songs = null;
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
        let model = this;
        model.tables = await Tables.init(token)
        model.selected_table = model.tables ? model.tables.first() : null
        return model
    }

    /**
     * @public
     * @param token  APIアクセスに使用するトークン
     * @returns {Tables}
     */
    async init_my_score(token) {
        let model = this;
        model.songs = await AllDetail.init(DateFormatter.format(Model.default_date()), token)
        return model
    }

    /**
     * @public
     * @param {string} token  APIアクセスに使用するトークン
     * @param {number} user_id スコアを取得するユーザーID
     * @returns {Tables}
     */
    async init_others_score(token, user_id) {
        let model = this;
        model.songs = await AllDetail.init_others(DateFormatter.format(this.date), user_id, token)
        return model
    }

    /**
     * @public
     * @returns {boolean}
     */
    song_is_set() {
        return !!this.songs
    }

    /**
     * @param {string} selected_level
     * @returns {SongDetail[]}
     */
    get_active_songs(selected_level) {
        return this.songs
            .table_specified(this.get_selected_table())
            .get_active(this.filter.visible_all_levels, selected_level)
    }

    /**
     * @public
     * @param {string} selected_level
     * @returns {SongDetail[]}
     */
    get_sorted_song_list(selected_level) {
        let songs = this.get_active_songs(selected_level);
        if (!songs) {
            return [SongDetail.dummy()]
        }
        return songs.sort(function (a, b) {
            let valA = a.sort_key(this.filter.sort_key, this.get_selected_table().levels);
            let valB = b.sort_key(this.filter.sort_key, this.get_selected_table().levels);
            return valA === valB ? 0 : ((valA < valB) ^ this.filter.sort_desc) ? -1 : 1;
        }.bind(this))
            .slice(0, parseInt(this.filter.max_length) > 0 ? this.filter.max_length : songs.length)
    }

    get_active_columns() {
        return config.DETAIL_COLUMNS.filter(c => this.filter.columns[c])
    }

    /**
     * @public
     * @returns {boolean}
     */
    tables_is_set(){
        return !!this.tables
    }

    /**
     * @public 選択状態の難易度表ががある
     * @returns {boolean}
     */
    table_is_set(){
        return !!this.selected_table
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
        let model = this;
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
            + window.location.host + "/%23/view?user_id=" + this.songs.user_id;
    }
}
