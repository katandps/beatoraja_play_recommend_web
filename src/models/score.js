export default class Score {
    /**
     * @private
     * @param {{
     *   max_combo: number,
     *   score: {},
     *   min_bp: {},
     *   clear_type: {},
     *   updated_at: string,
     *   play_count: number
     * }} score
     */
    constructor(score) {
        this.max_combo = score ? score.max_combo : 0;

        if (!score || !score.clear_type) {
            this.clear_type = "NoPlay"
            this.clear_type_before = "NoPlay"
            this.clear_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.clear_type = score.clear_type.current
            this.clear_type_before = score.clear_type.before
            this.clear_updated_at = score.clear_type.updated_at
        }

        if (!score || !score.score) {
            this.score = 0
            this.score_before = 0
            this.score_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.score = score.score.current
            this.score_before = score.score.before
            this.score_updated_at = score.score.updated_at
        }

        if (!score || !score.min_bp) {
            this.min_bp = -1
            this.min_bp_before = -1
            this.min_bp_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.min_bp = score.min_bp.current
            this.min_bp_before = score.min_bp.before
            this.min_bp_updated_at = score.min_bp.updated_at
        }
        this.updated_at = score ? score.updated_at : "1970-01-01T09:00:00+09:00"
        this.play_count = score ? score.play_count : 0
    }
}