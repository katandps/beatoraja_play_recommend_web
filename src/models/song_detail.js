import config from "../const"

export default class SongDetail {
    constructor() {
    }

    /**
     * @param {Song} song
     * @param {string} hash
     */
    init_song(song, hash) {
        if (!song) {
            this.title = "曲データなし"
            this.total_notes = 0
            this.md5 = hash
            this.sha256 = ""
            this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
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
     * @private
     * @param {number} total_notes
     * @param {number} ex_score
     * @return string
     */
    static make_clear_rank(total_notes, ex_score) {
        if (!total_notes || !ex_score) {
            return "F"
        }
        const max = total_notes * 2
        const rate = ex_score / max;
        if (rate >= 8 / 9) {
            return "AAA"
        }
        if (rate >= 7 / 9) {
            return "AA"
        }
        if (rate >= 6 / 9) {
            return "A"
        }
        if (rate >= 5 / 9) {
            return "B"
        }
        if (rate >= 4 / 9) {
            return "C"
        }
        if (rate >= 3 / 9) {
            return "D"
        }
        if (rate >= 2 / 9) {
            return "E"
        }
        return "F"
    }

    /**
     * @public //データがないときに使う
     * @return SongDetail
     */
    static dummy() {
        return new SongDetail(config.SONG_FORMAT[0][0].songs)
    }

    score_rate_format() {
        if (this.total_notes === 0) {
            return "00.00"
        }
        if (this.score === this.total_notes * 2) {
            return "100.0"
        }
        return (this.score / this.total_notes * 50).toFixed(2)
    }

    score_rate() {
        if (this.total_notes === 0) {
            return 0.0
        }
        return (this.score / this.total_notes)
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

    clear_type_description() {
        return `${this.clear_type_before}→${this.clear_type}(${this.clear_updated_at.split("T")[0]})`
    }

    score_description() {
        return `${this.score_before}→${this.score}(${this.score_updated_at.split("T")[0]})`
    }

    min_bp_description() {
        return `${this.min_bp_before}→${this.min_bp}(${this.min_bp_updated_at.split("T")[0]})`
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
                return config.LAMP_TYPE.length - config.LAMP_TYPE.indexOf(this.clear_type)
            case "title":
                return this.title.toLowerCase()
            case "rate":
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
                return config.LAMP_TYPE.length - config.LAMP_TYPE.indexOf(this.clear_type_before)
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
            case 'title':
                return this.title
            case 'level':
                return this.level
            case 'rate':
                return this.score_rate_format()
            case 'score':
                return `${this.score}/${this.total_notes * 2}`
            case 'score_before':
                return this.score_before
            case 'score_date':
                return this.score_updated_at.split("T")[0]
            case 'bp':
                return this.min_bp === -1 ? "---" : this.min_bp
            case 'bp_before':
                return this.min_bp_before === -1 ? "---" : this.min_bp_before
            case 'bp_date':
                return this.min_bp_updated_at.split("T")[0]
            case 'clear_before':
                return ''
            case 'clear_date':
                return this.clear_updated_at.split("T")[0]
            case 'combo':
                return this.max_combo
            case 'play':
                return this.play_count === -1 ? "---" : this.play_count
            case 'date':
                return this.updated_at.split("T")[0]
            case 'minir':
                return '<a href="https://www.gaftalk.com/minir/#/viewer/song/' + this.sha256 + '/' + this.mode + '" target="_blank">MinIR</a>'
            case 'mocha':
                return '<a href="https://mocha-repository.info/song.php?sha256=' + this.sha256 + '" target="_blank">Mocha</a>'
            case "clear_update":
                return this.clear_updated_at.split("T")[0] === this.updated_at.split("T")[0] ? `${this.clear_type_before} -> ${this.clear_type}` : "-"
            case "score_update":
                return this.score_before !== 0 ? `+${this.score - this.score_before} (${this.score})` : `${this.score}(new)`
            case "bp_update":
                return this.min_bp_before !== -1 ? `${this.min_bp - this.min_bp_before} (${this.min_bp})` : `${this.min_bp}(new)`
        }
    }
}