import SongFilter from "./songFilter"
import {DateFormatter} from "./date_formatter"
import SongDetail from "./song_detail"
import Tables from "./difficultyTable"

export default class Model {

    /**
     * @type {Tables|null}
     */
    tables = new Tables([])

    /**
     * @type {DifficultyTable}
     */
    selected_table = null

    /**
     * @type {string}
     */
    selected_level = ""

    /**
     * @type {Songs | null}
     */
    songs = null

    /**
     * @type {Scores | null}
     */
    scores = null

    /**
     * @type {Date}
     */
    date = Model.default_date()

    /**
     * @type {string}
     */
    rival_name = ""

    /**
     * @constructor
     * @public
     */
    constructor() {
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
     * @param {SongFilter} filter
     * @return {SongDetail[]}
     */
    filtered_score(filter) {
        return this.selected_table.get_filtered_score(filter)
    }

    /**
     * Detailで表示する曲のリストを得る
     *
     * @public
     * @param {SongFilter} filter
     * @returns {SongDetail[]}
     */
    get_sorted_song_list(filter) {
        if (!this.is_initialized()) {
            return [SongDetail.dummy()]
        }
        if (!filter) {
            filter = new SongFilter()
        }
        let songs = this.selected_table.get_filtered_score(filter)
        if (!filter.visible_all_levels) {
            songs = songs.filter(s => s.level === this.selected_level)
        }
        const length = filter.max_length > 0 ? filter.max_length : songs.length
        return songs.sort((a, b) => {
            let valA = a.sort_key(filter.sort_key, this.level_list())
            let valB = b.sort_key(filter.sort_key, this.level_list())
            return valA === valB ? 0 : ((valA < valB) ^ filter.sort_desc) ? -1 : 1
        }).slice(0, length)
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
        const table = this.selected_table
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
     * @public
     * @return String[]
     */
    level_list() {
        return this.selected_table.level_list || []
    }
}
