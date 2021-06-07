export default class Score {
    /**
     * @private
     */
    constructor() {
        this.max_combo = 0;

        this.clear_type = 0
        this.clear_type_before = 0
        this.clear_updated_at = "1970-01-01T09:00:00+09:00"

        this.score = 0
        this.score_before = 0
        this.score_updated_at = "1970-01-01T09:00:00+09:00"

        this.min_bp = -1
        this.min_bp_before = -1
        this.min_bp_updated_at = "1970-01-01T09:00:00+09:00"

        this.updated_at = "1970-01-01T09:00:00+09:00"
        this.play_count = 0
    }

    /**
     * @public
     * @param {{
     *   max_combo: number,
     *   score: {},
     *   min_bp: {},
     *   clear_type: {},
     *   updated_at: string,
     *   play_count: number
     * }} score
     */
    set_score(score) {
        this.max_combo = score.max_combo
        if (!(!score || !score.clear_type)) {
            this.clear_type = score.clear_type.current
            this.clear_type_before = score.clear_type.before
            this.clear_updated_at = score.clear_type.updated_at
        }
        if (!(!score || !score.score)) {
            this.score = score.score.current
            this.score_before = score.score.before
            this.score_updated_at = score.score.updated_at
        }
        if (!(!score || !score.min_bp)) {
            this.min_bp = score.min_bp.current
            this.min_bp_before = score.min_bp.before
            this.min_bp_updated_at = score.min_bp.updated_at
        }
        this.updated_at = score ? score.updated_at : "1970-01-01T09:00:00+09:00"
        this.play_count = score ? score.play_count : 0
    }
}