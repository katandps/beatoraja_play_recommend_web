import Api from "../api";

export default class Scores {
    /**
     * @private
     * @param {Object[]} score {(md5): song_detail}
     * @param {string} name
     * @param {number} user_id
     */
    constructor(score, name, user_id) {
        this.score = score
        this.name = name
        this.user_id = user_id
    }

    /**
     * @public
     * @param {string} date_str
     * @param {string} token
     * @returns {Scores}
     */
    static async init(date_str, token) {
        return await Api.fetch_my_score(date_str, token);
    }

    /**
     * @public
     * @param {string} date_str
     * @param {number} user_id
     * @param {string} token
     * @returns {Scores}
     */
    static async init_others(date_str, user_id, token) {
        return await Api.fetch_others_score(date_str, user_id, token);
    }

    /**
     * @public
     * @param {Table} table
     * @param {SongFilter} filter
     * @return SongDetail[]
     */
    apply_table(table, filter) {
        return Object.entries(table.levels)
            .map(([label, hashes]) => hashes.map(hash => this.score[hash].set_level(label)))
            .flat()
            .filter(s => filter.apply(s))
    }
}