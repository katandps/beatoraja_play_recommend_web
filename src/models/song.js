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
     * @param {number} user_id
     * @param {string} token
     * @returns {Scores}
     */
    static async init_others(date_str, user_id, token) {
        return await Api.fetch_others_score(date_str, user_id, token);
    }

    /**
     * ハッシュを指定してスコアを取得する
     * @public
     * @param md5
     */
    get_score(md5) {
        return this.score[md5]
    }
}