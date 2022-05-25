import Score from "./score";

export default class Scores {
    scores: {[key: string]: Score} = {};
    name: string
    user_id: number
    /**
     * @param {Object.<string, {clear_rank: string, max_combo: number, score: {}, min_bp: {}, clear_type: {}, updated_at: string}>} score_json
     * @param {string} name
     * @param {number} user_id
     */
    constructor(score_json: any, name: string, user_id: number) {
        for (const [hash, score] of Object.entries(score_json)) {
            this.scores[hash] = new Score()
            this.scores[hash].set_score(score)
        }
        this.name = name
        this.user_id = user_id
    }

    get_score(md5: string): Score {
        return this.scores[md5] ? this.scores[md5] : new Score()
    }
}