import config from '../const.js';

export default class Filter {
    constructor() {
        this.sort_desc = true;
        this.sort_key = "clear";
        this.columns = new Columns();
        this.visible_lamp = new VisibleLamp();
        this.visible_rank = new VisibleRank();
        this.day_before = 0;
        this.max_length = 200;
        this.visible_all_levels = false;
    }

    set_sort(key) {
        if (this.sort_key === key) {
            this.sort_desc = !this.sort_desc;
        }
        this.sort_key = key;
    }

    visible_reverse() {
        this.visible_lamp.reverse();
    }

    visible_all_lamp_type() {
        this.visible_lamp.to_all();
    }

    visible_not_full_combo() {
        this.visible_lamp.to_not_full_combo();
    }

    visible_not_ex_hard() {
        this.visible_lamp.to_not_ex_hard();
    }

    visible_not_hard() {
        this.visible_lamp.to_not_hard();
    }

    visible_not_easy() {
        this.visible_lamp.to_not_easy();
    }

    filter_all_term() {
        this.day_before = 0;
    }

    filter_older_half_year() {
        this.day_before = 180;
    }

    filter_older_one_year() {
        this.day_before = 365;
    }

    filter_older_two_year() {
        this.day_before = 730;
    }

    run(songs, table) {
        if (!songs || !table) {
            return [];
        }
        return songs.filtered(table, this);
    }

    should_show(song_detail) {
        return this.visible_lamp[song_detail.clear_type] && this.visible_rank[song_detail.clear_rank] && this.valid_date(song_detail);
    }

    valid_date(song_detail) {
        let date = new Date();
        date.setDate(date.getDate() - this.day_before);
        return config.dateFormatter.format(date) >= song_detail.updated_at.split("T")[0];
    }

    for_random() {
        this.sort_key = ''; //連続押し対応
        this.sort_key = 'random_select';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.default();
    }

    for_score() {
        this.sort_key = 'score_date';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_score();
        this.visible_all_lamp_type();
        this.visible_rank.to_all();
    }

    for_bp() {
        this.sort_key = 'bp_date';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_bp();
        this.visible_all_lamp_type();
        this.visible_rank.to_all();
    }

    for_aaa() {
        this.sort_key = 'rate';
        this.sort_desc = true;
        this.day_before = 0;
        this.columns.for_score();
        this.visible_all_lamp_type();
        this.visible_rank.to_not_aaa();
    }

    for_aa() {
        this.sort_key = 'rate';
        this.sort_desc = true;
        this.day_before = 0;
        this.columns.for_score();
        this.visible_all_lamp_type();
        this.visible_rank.to_not_aa();
    }

    for_easy() {
        this.sort_key = 'bp';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_bp();
        this.visible_not_easy();
        this.visible_rank.to_all();
    }

    for_hard() {
        this.sort_key = 'bp';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_bp();
        this.visible_not_hard();
        this.visible_rank.to_all();
    }

    for_ex_hard() {
        this.sort_key = 'bp';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_bp();
        this.visible_not_ex_hard();
        this.visible_rank.to_all();
    }

    for_full_combo() {
        this.sort_key = 'bp';
        this.sort_desc = false;
        this.day_before = 0;
        this.columns.for_bp();
        this.visible_not_full_combo();
        this.visible_rank.to_all();
    }
}

class Columns {
    constructor() {
        this.default();
    }

    default() {
        this.clear = true;
        this.clear_date = false;
        this.clear_before = false;
        this.level = true;
        this.title = true;
        this.rate = true;
        this.score = true;
        this.score_date = false;
        this.score_before = false;
        this.bp = true;
        this.bp_date = false;
        this.bp_before = false;
        this.combo = true;
        this.play = true;
        this.date = true;
    }

    for_score() {
        this.default();
        this.score_date = true;
        this.score_before = true;
    }

    for_bp() {
        this.default();
        this.bp_date = true;
        this.bp_before = true;
    }
}

class VisibleLamp {
    constructor() {
        this.Max = true;
        this.Perfect = true;
        this.FullCombo = true;
        this.ExHard = true;
        this.Hard = true;
        this.Normal = true;
        this.Easy = true;
        this.LightAssistEasy = true;
        this.AssistEasy = true;
        this.Failed = true;
        this.NoPlay = true;
    }

    reverse() {
        this.Max = !this.Max;
        this.Perfect = !this.Perfect;
        this.FullCombo = !this.FullCombo;
        this.ExHard = !this.ExHard;
        this.Hard = !this.Hard;
        this.Normal = !this.Normal;
        this.Easy = !this.Easy;
        this.LightAssistEasy = !this.LightAssistEasy;
        this.AssistEasy = !this.AssistEasy;
        this.Failed = !this.Failed;
        this.NoPlay = !this.NoPlay;
    }

    to_all() {
        config.LAMP_TYPE.forEach(type => this[type] = true);
    }

    to_not_full_combo() {
        this.to_all();
        this.Max = false;
        this.Perfect = false;
        this.FullCombo = false;
    }

    to_not_ex_hard() {
        this.to_not_full_combo();
        this.ExHard = false;
    }

    to_not_hard() {
        this.to_not_ex_hard();
        this.Hard = false;
    }

    to_not_easy() {
        this.to_not_hard();
        this.Normal = false;
        this.Easy = false;
    }
}

class VisibleRank {
    constructor() {
        this.AAA = true;
        this.AA = true;
        this.A = true;
        this.B = true;
        this.C = true;
        this.D = true;
        this.E = true;
        this.F = true;
    }

    to_all() {
        config.RANK_TYPE.forEach(type => this[type] = true);
    }

    to_not_aaa() {
        this.to_all();
        this.AAA = false;
    }

    to_not_aa() {
        this.to_not_aaa();
        this.AA = false;
    }
}