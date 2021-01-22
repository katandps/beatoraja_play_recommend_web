import config from "../const"

export default class SongDetail {
    constructor(song) {
        this.level = song.level
        this.title = song.title
        this.max_combo = song.max_combo

        if (song.clear_type === null) {
            this.clear_type = "NoPlay"
            this.clear_type_before = "NoPlay"
            this.clear_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.clear_type = song.clear_type.current
            this.clear_type_before = song.clear_type.before
            this.clear_updated_at = song.clear_type.updated_at
        }

        if (song.score === null) {
            this.score = 0
            this.score_before = 0
            this.score_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.score = song.score.current
            this.score_before = song.score.before
            this.score_updated_at = song.score.updated_at
        }

        if (song.min_bp === null) {
            this.min_bp = -1
            this.min_bp_before = -1
            this.min_bp_updated_at = "1970-01-01T09:00:00+09:00"
        } else {
            this.min_bp = song.min_bp.current
            this.min_bp_before = song.min_bp.before
            this.min_bp_updated_at = song.min_bp.updated_at
        }
        this.clear_rank = song.clear_rank
        this.updated_at = song.updated_at
        this.play_count = song.play_count
        this.total_notes = song.total_notes

        this.sha256 = song.hash
        this.md5 = song.md5
        this.mode = 0 //todo モード対応
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
        }
    }
}