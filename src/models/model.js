import SongFilter from "./songFilter"
import Tables from "./difficultyTable"
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
         * @type {DifficultyTable}
         */
        this.selected_table = null

        /**
         * @public
         * @type {string}
         */
        this.selected_level = ""
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
     * @returns {Model}
     */
    async init_table(token) {
        let model = this
        model.tables = await Tables.init(token)
        model.selected_table = model.tables ? model.tables.first() : null
        model = model.init_table_score()
        return model
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
        model = model.init_table_score()
        return model
    }

    /**
     * @private
     * @return Model
     */
    init_table_score() {
        if (!this.is_initialized()) {
            return this;
        }
        let model = this;
        model.selected_table = model.selected_table.set_score(this.songs)
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
     * @return {SongDetail[][][]} get_lank_list[level][rank][index]
     */
    get_lamp_list() {
        if (!this.is_initialized()) {
            return []
        }
        let levels = this.get_selected_table().level_list;
        let lamps = config.LAMP_TYPE;
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        return levels.map(
            level => lamps.map(
                lamp => songs.filter(s => s.clear_type === lamp && s.level === level).sort(s => s.title)
            )
        )    }

    /**
     * @public
     * @return {SongDetail[][][]} get_rank_list[level][rank][index]
     */
    get_rank_list() {
        if (!this.is_initialized()) {
            return []
        }
        let levels = this.get_selected_table().level_list;
        let ranks = config.RANK_TYPE;
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        return levels.map(
            l => ranks.map(
                r => songs.filter(s => s.clear_rank === r && s.level === l).sort(s => s.title)
            )
        )
    }

    /**
     * @public
     * @returns {SongDetail[]}
     */
    get_sorted_song_list() {
        if (!this.is_initialized()) {
            return [SongDetail.dummy()]
        }
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        if (!this.filter.visible_all_levels) {
            songs = songs.filter(s => s.level === this.selected_level)
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
     * @returns {DifficultyTable}
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
        model = model.init_table_score()
        model = model.set_default_selected_level()
        return model
    }

    /**
     * @return Model
     */
    set_default_selected_level () {
        let model = this
        const table = this.get_selected_table()
        if (!table.contains_level(this.selected_level)) {
            model.selected_level = table.level_list[0]
        }
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
