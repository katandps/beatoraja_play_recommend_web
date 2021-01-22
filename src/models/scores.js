import Score from "./score";

export default class Scores {
    /**
     * @param {Object.<string, {clear_rank: string, max_combo: number, score: {}, min_bp: {}, clear_type: {}, updated_at: string}>} score_json
     * @param {string} name
     * @param {number} user_id
     */
    constructor(score_json, name, user_id) {
        let scores = {};
        for (const [hash, score] of Object.entries(score_json)) {
            scores[hash] = new Score(score)
        }
        /**
         * @type {Object.<string, Score>}
         */
        this.scores = scores

        this.name = name
        this.user_id = user_id
    }

    /**
     * ハッシュを指定してスコアを取得する
     * @public
     * @param md5
     */
    get_score(md5) {
        return this.scores[md5]
    }
}