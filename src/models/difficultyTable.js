import SongDetail from "./song_detail"
// import * as log from "loglevel"

export default class Tables {
    /**
     * @param {Object[]} json
     */
    constructor(json) {
        /**
         * @type {DifficultyTable[]}
         */
        this.tables = []
        json.forEach(t => this.tables.push(new DifficultyTable(t.name, t.levels, t.level_list)))
    }

    /**
     * @public
     * @returns {string[]}
     */
    name_list() {
        return this.tables.map(t => t.name)
    }

    /**
     * @returns {null|DifficultyTable}
     */
    first() {
        return this.tables.length === 0 ? null : this.tables[0]
    }

    /**
     * @private
     * @param table_name
     * @returns {number}
     */
    table_index(table_name) {
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name === table_name) {
                return i
            }
        }
        return -1
    }

    /**
     * @param table_name
     * @returns {DifficultyTable|null}
     */
    get_table(table_name) {
        return this.tables[this.table_index(table_name)] || null
    }

    /**
     * 設定でフィルタリングされた曲データを返す
     * 対象は全曲
     * @param {SongFilter} filter
     * @return {SongDetail[]}
     */
    get_filtered_score(filter) {
        let ret = [];
        let md5s = {};
        this.tables.forEach((table) => {
            table.get_filtered_score(filter).forEach((song) => {
                if (!md5s[song.md5]) {
                    md5s[song.md5] = true;
                    ret.push(song)
                }
            })
        })
        return ret
    }

    /**
     * @public
     * @param {Songs} songs
     * @param {Scores} scores
     * @return {Tables}
     */
    set_score(songs, scores) {
        let tables = this;
        tables.tables = this.tables.map((table) => table.set_score(songs, scores))
        return tables
    }

    /**
     * @public
     * @param scores
     * @returns {Tables}
     */
    set_rival_score(scores) {
        let tables = this;
        tables.tables = this.tables.map((table) => table.set_rival_score(scores))
        return tables
    }
}

export class DifficultyTable {
    constructor(name, levels, level_list) {
        /**
         * @type string
         */
        this.name = name
        /**
         * @type {Object.<string, string[]>} level_label: hash[]
         */
        this.levels = levels
        /**
         * @type string[]
         */
        this.level_list = level_list
        /**
         * @type {Object.<string, Object.<string, SongDetail>>}
         */
        this.table_score = {}
        this.level_list.forEach(level => this.table_score[level] = {})
    }

    /**
     * @public
     * @param {Songs} songs
     * @param {Scores} scores
     * @return DifficultyTable
     */
    set_score(songs, scores) {
        let table = this
        Object.entries(table.levels).forEach(
            ([level_label, hashes]) => hashes.forEach(
                hash => {
                    if (!table.table_score[level_label][hash]) {
                        table.table_score[level_label][hash] = new SongDetail()
                    }
                    table.table_score[level_label][hash].init_score(scores.get_score(hash))
                    table.table_score[level_label][hash].init_song(songs.get_score(hash), hash)
                    table.table_score[level_label][hash].set_level(level_label)
                }
            )
        )
        return table
    }

    /**
     * @public
     * @param {Scores} scores
     * @return DifficultyTable
     */
    set_rival_score(scores) {
        let table = this
        Object.entries(table.levels).forEach(
            ([level_label, hashes]) => hashes.forEach(
                hash => {
                    if (!table.table_score[level_label][hash]) {
                        table.table_score[level_label][hash] = new SongDetail()
                    }
                    table.table_score[level_label][hash].init_rival_score(scores.get_score(hash))
                }
            )
        )
        return table
    }

    /**
     * @public
     * @param {SongFilter} filter
     * @return SongDetail[]
     */
    get_filtered_score(filter) {
        return Object.values(this.table_score).map(
            /**
             * @param {Object.<string, SongDetail>} scores
             * @returns {unknown[]}
             */
            scores => {
                return Object.values(scores).filter(
                    /**
                     * @param {SongDetail} s
                     * @returns {boolean}
                     */
                    s => filter.apply(s))
            }
        ).flat()
    }

    /**
     * @public
     * @param {string} table_name
     * @returns {boolean}
     */
    contains_level(table_name) {
        return this.level_list.indexOf(table_name) !== -1
    }
}
