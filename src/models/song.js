import config from '../const.js';

export default class AllDetail {
    constructor(tables, name, user_id) {
        this.tables = [];
        this.name = name;
        this.user_id = user_id;
        tables.forEach(t => this.tables.push(new TableDetail(t.table, t.levels)));
    }

    filtered(table, filter) {
        return this.tables.find(t => t.name === table.name).filtered(filter);
    }
}

class TableDetail {
    constructor(table, levels) {
        this.name = table;
        this.levels = [];
        levels.forEach(s => this.levels.push(new LevelDetail(s.level, s.songs)));
    }

    filtered(filter) {
        return this.levels.map(level_detail => new Object({
            level: level_detail.name,
            songs: level_detail.filtered(filter),
        }));
    }
}

class LevelDetail {
    constructor(level, songs) {
        this.name = level;
        this.songs = [];
        songs.forEach(s => this.songs.push(new SongDetail(s)));
    }

    filtered(filter) {
        return this.songs.filter(song_detail => filter.should_show(song_detail));
    }
}

class SongDetail {
    constructor(song) {
        this.level = song.level;
        this.title = song.title;
        this.max_combo = song.max_combo;

        this.clear_type = song.clear_type.current;
        this.clear_type_before = song.clear_type.before;
        this.clear_updated_at = song.clear_type.updated_at;

        this.score = song.score.current;
        this.score_before = song.score.before;
        this.score_updated_at = song.score.updated_at;

        this.min_bp = song.min_bp.current;
        this.min_bp_before = song.min_bp.before;
        this.min_bp_updated_at = song.min_bp.updated_at;

        this.clear_rank = song.clear_rank;
        this.updated_at = song.updated_at;
        this.play_count = song.play_count;
        this.total_notes = song.total_notes;
    }

    score_rate() {
        if (this.score === this.total_notes * 2) {
            return "100.0";
        }
        return (this.score / this.total_notes * 50).toFixed(2)
    }

    clear_type_description() {
        return `${this.clear_type_before}→${this.clear_type}(${this.clear_updated_at.split("T")[0]})`;
    }

    score_description() {
        return `${this.score_before}→${this.score}(${this.score_updated_at.split("T")[0]})`;
    }

    min_bp_description() {
        return `${this.min_bp_before}→${this.min_bp}(${this.min_bp_updated_at.split("T")[0]})`;
    }

    sort_key(sort_key, levels) {
        switch (sort_key) {
            case "level":
                return levels.indexOf(this.level);
            case "clear":
                return config.LAMP_TYPE.length - config.LAMP_TYPE.indexOf(this.clear_type);
            case "title":
                return this.title.toLowerCase();
            case "rate":
                return this.score_rate();
            case "score":
                return this.score;
            case "bp":
                return this.min_bp;
            case "combo":
                return this.max_combo;
            case "play":
                return this.play_count;
            case "date":
                return this.updated_at;
            case "score_before":
                return this.score_before;
            case "score_date":
                return this.score_updated_at;
            case "bp_date":
                return this.min_bp_updated_at;
            case 'bp_before':
                return this.min_bp_before;
            case 'clear_date':
                return this.clear_updated_at;
            case 'clear_before':
                return config.LAMP_TYPE.length - config.LAMP_TYPE.indexOf(this.clear_type_before);
            case 'random_select':
                return Math.floor(Math.random() * Math.floor(100000000));
            default:
                return;
        }
    }

    get(type) {
        switch (type) {
            case 'clear':
                return '';
            case 'title':
                return this.title;
            case 'level':
                return this.level;
            case 'rate':
                return this.score_rate();
            case 'score':
                return `${this.score}/${this.total_notes * 2}`;
            case 'score_before':
                return this.score_before;
            case 'score_date':
                return this.score_updated_at.split("T")[0];
            case 'bp':
                return this.min_bp === -1 ? "---" : this.min_bp;
            case 'bp_before':
                return this.min_bp_before === -1 ? "---" : this.min_bp_before;
            case 'bp_date':
                return this.min_bp_updated_at.split("T")[0];
            case 'clear_before':
                return '';
            case 'clear_date':
                return this.clear_updated_at.split("T")[0];
            case 'combo':
                return this.max_combo;
            case 'play':
                return this.play_count === -1 ? "---" : this.play_count;
            case 'date':
                return this.updated_at.split("T")[0];
        }
    }
}