export default class Columns {
    constructor(columns) {
        this.default()
        Object.assign(this, columns)
    }

    default() {
        this.clear = true
        this.clear_date = false
        this.clear_before = false
        this.level = true
        this.title = true
        this.rate = true
        this.score = true
        this.score_date = false
        this.score_before = false
        this.bp = true
        this.bp_date = false
        this.bp_before = false
        this.combo = true
        this.play = true
        this.date = true

        this.clear_update = true
        this.rank_update = true
        this.score_update = true
        this.bp_update = true

        this.clear_diff_rival = true
        this.score_diff_rival = true
        this.bp_diff_rival = true
        this.rival_date = true
    }

    for_score() {
        this.default()
        this.score_date = true
        this.score_before = true
    }

    for_bp() {
        this.default()
        this.bp_date = true
        this.bp_before = true
    }
}
