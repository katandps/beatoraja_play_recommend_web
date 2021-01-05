import Api from "../api";
import SongDetail from "./song_detail";

export default class AllDetail {
    /**
     * @private
     * @param {Object[]} tables
     * @param {string} name
     * @param {number} user_id
     */
    constructor(tables, name, user_id) {
        this.tables = [];
        tables.forEach(t => this.tables.push(new TableDetail(t.table, t.levels)));
        this.name = name
        this.user_id = user_id
    }

    /**
     * @public
     * @param {string} date_str
     * @param {string} token
     * @returns {AllDetail}
     */
    static async init(date_str, token) {
        return await Api.fetch_my_score(date_str, token);
    }

    /**
     * @public
     * @param {string} date_str
     * @param {number} user_id
     * @param {string} token
     * @returns {AllDetail}
     */
    static async init_others(date_str, user_id, token) {
        return await Api.fetch_others_score(date_str, user_id, token);
    }

    filtered(table, filter) {
        return this.tables.find(t => t.name === table.name).filtered(filter);
    }

    /**
     * @public
     * @param {Table} table
     * @return TableDetail
     */
    table_specified(table) {
        return this.tables.find(t => t.name === table.name)
    }
}

class TableDetail {
    constructor(table, levels) {
        /**
         * @type {string}
         */
        this.name = table;
        /**
         * @type {LevelDetail[]}
         */
        this.levels = [];
        levels.forEach(s => this.levels.push(new LevelDetail(s.level, s.songs)));
    }

    filtered(filter) {
        return this.levels.map(level_detail => new Object({
            level: level_detail.name,
            songs: level_detail.filtered(filter),
        }));
    }


    /**
     * @param {boolean} visible_all_levels
     * @param {string} selected_level
     * @returns {SongDetail[]}
     */
    get_active(visible_all_levels, selected_level) {
        if (visible_all_levels) {
            return this.levels.map(level_detail => level_detail.songs).flat();
        } else {
            return this.levels
                .filter(level_detail => level_detail.name === selected_level)
                .map(level_detail => level_detail.songs)
                .flat()
        }
    }
}

class LevelDetail {
    constructor(level, songs) {
        /**
         * @type {string}
         */
        this.name = level;
        /**
         * @type {SongDetail[]}
         */
        this.songs = [];
        songs.forEach(s => this.songs.push(new SongDetail(s)));
    }

    /**
     * @param filter
     * @returns {SongDetail[]}
     */
    filtered(filter) {
        return this.songs.filter(song_detail => filter.should_show(song_detail));
    }
}
