import SongFilter from "./songFilter"
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
         * @type {Songs}
         */
        this.songs = null
        /**
         * @private
         * @type {Scores}
         */
        this.scores = null
        /**
         * @private
         * @type {Date}
         */
        this.date = Model.default_date()

        this.rival_name = ""
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
     * @param {Tables} tables
     * @returns {Model}
     */
    init_table(tables) {
        let model = this
        model.tables = tables
        model.selected_table = model.tables ? model.tables.first() : null
        model = model.init_table_score()
        return model
    }

    /**
     * @param {Scores} scores
     * @returns {Model}
     */
    init_score(scores) {
        let model = this
        model.scores = scores
        model = model.init_table_score()
        return model
    }

    /**
     * @param {Songs} songs
     * @returns {Model}
     */
    init_songs(songs) {
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
            return this
        }
        let model = this
        model.tables = model.tables.set_score(this.songs, this.scores)
        return model
    }

    /**
     * @public
     * @param {Scores} scores
     * @returns {Model}
     */
    renew_with_rival_score(scores) {
        if (!this.is_initialized()) {
            return this
        }
        let model = Object.assign(new Model(), this)
        model.tables = this.tables.set_rival_score(scores)
        model.rival_name = scores.name
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
     * @public
     * @returns {boolean}
     */
    score_is_set() {
        return !!this.scores
    }

    is_initialized() {
        return this.tables_is_set() && this.song_is_set() && this.score_is_set()
    }

    /**
     * @public
     * @return {SongDetail[][][]} get_lank_list[level][rank][index]
     */
    get_lamp_list() {
        if (!this.is_initialized()) {
            return []
        }
        let levels = this.get_selected_table().level_list
        let lamps = config.LAMP_INDEX
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        return levels.map(
            level => lamps.map(
                (_lamp, index) => songs.filter(s => s.clear_type === index && s.level === level).sort(SongDetail.cmp_title)
            )
        )
    }

    /**
     * @public
     * @return {SongDetail[][][]} get_rank_list[level][rank][index]
     */
    get_rank_list() {
        if (!this.is_initialized()) {
            return []
        }
        let levels = this.get_selected_table().level_list
        let ranks = config.RANK_TYPE
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        return levels.map(
            l => ranks.map(
                r => songs.filter(s => s.clear_rank === r && s.level === l).sort(SongDetail.cmp_title)
            )
        )
    }

    /**
     * @public
     * @returns {SongDetail[][]}
     */
    get_lamp_stat() {
        if (!this.is_initialized()) {
            return []
        }
        let lamps = config.LAMP_INDEX
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        if (!this.filter.visible_all_levels) {
            songs = songs.filter(s => s.level === this.selected_level)
        }
        return lamps.map(
            (_lamp, index) => songs.filter(s => s.clear_type === index).sort(SongDetail.cmp_title)
        )
    }

    /**
     * @public
     * @returns {SongDetail[][]}
     */
    get_rank_stat() {
        if (!this.is_initialized()) {
            return []
        }
        let ranks = config.RANK_TYPE
        let songs = this.get_selected_table().get_filtered_score(this.filter)
        if (!this.filter.visible_all_levels) {
            songs = songs.filter(s => s.level === this.selected_level)
        }
        return ranks.map(
            (r) => songs.filter(s => s.clear_rank === r).sort(SongDetail.cmp_title)
        )
    }

    /**
     * Detailで表示する曲のリストを得る
     *
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
        const length = parseInt(this.filter.max_length) > 0 ? this.filter.max_length : songs.length
        return songs.sort(this.cmp.bind(this)).slice(0, length)
    }

    /**
     * Recentで表示する曲のリストを得る
     *
     * @public
     * @returns {SongDetail[]}
     */
    get_recent_song_list() {
        if (!this.is_initialized()) {
            return [SongDetail.dummy()]
        }
        let songs = this.tables.get_filtered_score(new SongFilter)
        const length = parseInt(this.filter.max_length) > 0 ? this.filter.max_length : songs.length
        return songs.sort((a, b) => {
            return a.updated_at === b.updated_at ? 0 : (a.updated_at < b.updated_at) ? 1 : -1
        }).slice(0, length)
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
     * @returns {({name: string, title: string, class: string, key: string})[]}
     */
    get_recent_columns() {
        return config.RECENT_COLUMNS
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
        return this.score_is_set() ? this.scores.name : ""
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
        if (!this) {
            return null
        }
        let model = this
        model.selected_table = this.tables ? this.tables.get_table(table_name) : null
        model = model.init_table_score()
        model = model.set_default_selected_level()
        return model
    }

    /**
     * @return Model
     */
    set_default_selected_level() {
        let model = this
        const table = this.get_selected_table()
        if (!table.contains_level(this.selected_level)) {
            model.selected_level = table.level_list[0]
        }
        return model
    }

    /**
     * @returns {string}
     */
    get_date_str() {
        return DateFormatter.format(this.date)
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
        if (!this.score_is_set()) {
            return ""
        }
        return "https://twitter.com/intent/tweet?url="
            + window.location.host + "/%23/view?user_id=" + this.scores.user_id
    }

    /**
     * @param {string} key
     * @return {boolean}
     */
    sort_key_is(key) {
        return this.filter.sort_key === key
    }

    /**
     * @public
     * @return String[]
     */
    level_list() {
        const table = this.get_selected_table()
        return table.level_list || []
    }
}
