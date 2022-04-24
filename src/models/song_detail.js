import config from "../const"
import Score from "./score";

export default class SongDetail {
    constructor() {
        this.init_score(new Score())
        this.init_rival_score(new Score())
    }

    title = "曲データなし"
    total_notes = 0
    md5
    sha256 = ""
    clear_rank = SongDetail.make_clear_rank(0, 0)

    /**
     * @param {Song} song
     * @param {string} hash
     */
    init_song(song, hash) {
        if (!song) {
            this.md5 = hash
            return;
        }
        this.title = song.title
        this.total_notes = song.notes
        this.md5 = song.md5
        this.sha256 = song.sha256

        this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
    }

    /**
     * @param {Score} score
     */
    init_score(score) {
        this.max_combo = score.max_combo

        this.clear_type = score.clear_type
        this.clear_type_before = score.clear_type_before
        this.clear_updated_at = score.clear_updated_at

        this.score = score.score
        this.score_before = score.score_before
        this.score_updated_at = score.score_updated_at

        this.min_bp = score.min_bp
        this.min_bp_before = score.min_bp_before
        this.min_bp_updated_at = score.min_bp_updated_at

        this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
        this.updated_at = score.updated_at
        this.play_count = score.play_count
        this.mode = 0
    }

    /**
     * @param {Score} score
     */
    init_rival_score(score) {
        this.rival_max_combo = score.max_combo
        this.rival_clear_type = score.clear_type
        this.rival_score = score.score
        this.rival_min_bp = score.min_bp
        this.rival_clear_rank = SongDetail.make_clear_rank(this.total_notes, this.rival_score)
        this.rival_updated_at = score.updated_at
    }

    /**
     * @public
     * @param {number} total_notes
     * @param {number} ex_score
     * @return string
     */
    static make_clear_rank(total_notes, ex_score) {
        if (!total_notes || !ex_score) {
            return "F"
        }
        const max = total_notes * 2
        return config.RANK_TYPE[config.RANK_RATE_BY_9.findIndex(v => ~~((v * max + 8) / 9) <= ex_score )]
    }

    static make_clear_rank2(total_notes, ex_score) {
        if (!total_notes || !ex_score) {
            return "F6"
        }
        const max = total_notes * 2
        return config.DETAIL_RANK_TYPE[config.DETAIL_RANK_BY_27.findIndex(v => ~~((v * max + 26) / 27) <= ex_score )]
    }

    /**
     * @public //データがないときに使う
     * @return SongDetail
     */
    static dummy() {
        return new SongDetail(config.SONG_FORMAT[0][0].songs)
    }

    score_rate_format(score) {
        if (this.total_notes === 0) {
            return "00.00"
        }
        if (score === this.total_notes * 2) {
            return "100.0"
        }
        return (score / this.total_notes * 50).toFixed(2)
    }

    score_rate() {
        if (this.total_notes === 0) {
            return 0.0
        }
        return (this.score / this.total_notes) * 50
    }

    clear_type_bg_class() {
        return 'bg-' + config.LAMP_INDEX[this.clear_type]
    }

    clear_type_before_bg_class() {
        return 'bg-' + config.LAMP_INDEX[this.clear_type_before]
    }

    clear_type_rival_bg_class() {
        return 'bg-' + config.LAMP_INDEX[this.rival_clear_type]
    }

    /**
     * @public
     * @param {string} level
     * @returns {SongDetail}
     */
    set_level(level) {
        let ret = this
        ret.level = level
        return ret
    }

    /**
     * @param {SongDetail} a
     * @param {SongDetail} b
     */
    static cmp_title(a, b) {
        if (a.title === b.title) {
            return 0
        }
        return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    }

    /**
     * @public
     * @param {string} sort_key
     * @param {string[]} level_list
     * @returns {string|string|*|number}
     */
    sort_key(sort_key, level_list) {
        switch (sort_key) {
            case "level":
                return level_list.indexOf(this.level)
            case "clear":
                return this.clear_type
            case "title":
                return this.title.toLowerCase()
            case "rate":
                return this.score_rate()
            case "score_rank":
                return this.score_rate()
            case "score_rank2":
                return this.score_rate()
            case "score":
                return this.score
            case "bp":
                return this.min_bp
            case "combo":
                return this.max_combo
            case "play":
                return this.play_count
            case "date":
                return this.updated_at
            case "score_before":
                return this.score_before
            case "score_date":
                return this.score_updated_at
            case "bp_date":
                return this.min_bp_updated_at
            case 'bp_before':
                return this.min_bp_before
            case 'clear_date':
                return this.clear_updated_at
            case 'clear_before':
                return this.clear_type_before
            case "clear_diff_rival":
                return this.clear_type - this.rival_clear_type
            case "score_diff_rival":
                return this.score - this.rival_score
            case "bp_diff_rival": {
                let min_bp = this.min_bp === -1 ? this.total_notes : this.min_bp
                let rival = this.rival_min_bp === -1 ? this.total_notes : this.rival_min_bp
                return rival - min_bp
            }
            case "rival_date":
                return this.rival_updated_at
            case 'random_select':
                return Math.floor(Math.random() * Math.floor(100000000))
            default:
                return 0
        }
    }

    get(type) {
        switch (type) {
            case 'clear':
                return ''
            case 'clear_type_index':
                return this.clear_type
            case 'clear_type':
                return config.LAMP_INDEX[this.clear_type]
            case 'rival_clear_type':
                return config.LAMP_INDEX[this.rival_clear_type]
            case 'title':
                return this.title
            case 'level':
                return this.level
            case 'notes':
                return this.total_notes
            case 'rate':
                return this.score_rate_format(this.score)
            case 'rival_rate':
                return this.score_rate_format(this.rival_score)
            case 'rank':
                return SongDetail.make_clear_rank(this.total_notes, this.score)
            case 'rank2':
                return SongDetail.make_clear_rank2(this.total_notes, this.score)
            case 'rival_rank':
                return SongDetail.make_clear_rank(this.total_notes, this.rival_score)
            case 'score':
                return `${this.score}/${this.total_notes * 2}`
            case 'score_rate':
                return this.total_notes === 0 ? 0 : this.score / this.total_notes / 2
            case 'rival_score':
                return this.rival_score
            case 'score_before':
                return this.score_before
            case 'score_date':
                return this.score_updated_at.split("T")[0]
            case 'bp':
                return this.min_bp === -1 ? "---" : this.min_bp
            case 'rival_bp':
                return this.rival_min_bp
            case 'bp_before':
                return this.min_bp_before === -1 ? "---" : this.min_bp_before
            case 'bp_date':
                return this.min_bp_updated_at.split("T")[0]
            case 'clear_before':
                return ''
            case 'clear_type_before':
                return config.LAMP_INDEX[this.clear_type_before]
            case 'clear_date':
                return this.clear_updated_at.split("T")[0]
            case 'combo':
                return this.max_combo
            case 'rival_combo':
                return this.rival_max_combo
            case 'combos':
                return `${this.max_combo}/${this.total_notes}`
            case 'combo_rate':
                return this.total_notes === 0 ? 0 : this.max_combo / this.total_notes
            case 'play':
                return this.play_count === -1 ? "---" : this.play_count
            case 'date':
                return this.updated_at.split("T")[0] === "1970-01-01" ? "---" : this.updated_at.split("T")[0]
            case 'viewer':
                return '<a href="http://www.ribbit.xyz/bms/score/view?md5=' + this.md5 + '" target="_blank">Viewer</a>'
            case 'minir':
                return '<a href="https://www.gaftalk.com/minir/#/viewer/song/' + this.sha256 + '/' + this.mode + '" target="_blank">MinIR</a>'
            case 'mocha':
                return '<a href="https://mocha-repository.info/song.php?sha256=' + this.sha256 + '" target="_blank">Mocha</a>'
            case "clear_diff_rival":
                return this.clear_type === this.rival_clear_type
                    ? '<span class="draw">draw</span>'
                    : this.clear_type < this.rival_clear_type ? '<span class="lose">lose</span>' : '<span class="win">win</span>'
            case "score_diff_rival": {
                let diff = this.score - this.rival_score
                let span_class = diff === 0 ? 'draw' : diff > 0 ? 'win' : 'lose'
                return "<span class=" + span_class + ">" + diff + "</span>"
            }
            case "bp_diff_rival":
                if (this.rival_min_bp === -1 || this.min_bp === -1) {
                    return "---"
                } else {
                    let diff = this.min_bp - this.rival_min_bp
                    let span_class = diff === 0 ? 'draw' : diff > 0 ? 'lose' : 'win'
                    return "<span class=" + span_class + ">" + diff + "</span>"
                }
            case "rival_date":
                return this.rival_updated_at.split("T")[0] === "1970-01-01" ? "---" : this.rival_updated_at.split("T")[0]
        }
    }
}