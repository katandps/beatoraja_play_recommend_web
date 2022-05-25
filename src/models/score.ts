export default class Score {
    
    max_combo: number = 0

    clear_type: number = 0
    clear_type_before:number = 0
    clear_updated_at: string = "1970-01-01T09:00:00+09:00"

    score: number = 0
    score_before : number = 0
    score_updated_at: string = "1970-01-01T09:00:00+09:00"

    min_bp: number = -1
    min_bp_before: number = -1
    min_bp_updated_at : string = "1970-01-01T09:00:00+09:00"

    updated_at: string = "1970-01-01T09:00:00+09:00"
    play_count: number = 0

    constructor() {}

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
    set_score(score: any) {
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