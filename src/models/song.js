export default class AllDetail {
    constructor(tables) {
        this.tables = [];
        tables.forEach(t => this.tables.push(new TableDetail(t.table, t.levels)));
    }

    filtered(table_index, visible_song, filter_date) {
        return this.tables[table_index].filtered(visible_song, filter_date);
    }
}

class TableDetail {
    constructor(table, levels) {
        this.name = table;
        this.levels = [];
        levels.forEach(s => this.levels.push(new LevelDetail(s.level, s.songs)));
    }

    filtered(visible_song, filter_date) {
        return this.levels.map(level_detail => new Object({
            level: level_detail.name,
            songs: level_detail.filtered(visible_song, filter_date),
        }));
    }
}

class LevelDetail {
    constructor(level, songs) {
        this.name = level;
        this.songs = [];
        songs.forEach(s => this.songs.push(new SongDetail(s)));
    }

    filtered(visible_song, filter_date) {
        return this.songs.filter(song_detail => song_detail.is_visible(visible_song, filter_date));
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

    is_visible(visible_song, filter_date) {
        return visible_song.includes(this.clear_type)
            && visible_song.includes(this.clear_rank)
            && this.updated_at <= filter_date;
    }

    score_rate() {
        if (this.score === this.total_notes * 2) {
            return "100.0";
        }
        return (this.score / this.total_notes * 50).toFixed(2)
    }
}