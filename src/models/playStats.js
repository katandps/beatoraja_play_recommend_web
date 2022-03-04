export default class PlayStats {
    /**
     * @param {{log: {play_count: number, clear_count: number, play_time: number}}} json
     */
    constructor(json) {
        this.logs = []
        if (json.log) {
              json.log.reverse().forEach(t => this.logs.push(
                new PlayStat(
                    t.play_count,
                    t.clear_count,
                    t.play_time,
                    t.date,
                    t.total_judge
                )))
        }

    }

    /**
     * @public
     * @returns {PlayStats}
     */
    static default() {
        return new PlayStats({log:[]})
    }
}


export class PlayStat {
    constructor(play_count, clear_count, play_time, date, total_judge) {
        this.play_count = play_count
        this.clear_count = clear_count
        this.play_time = play_time
        this.date = date
        this.total_judge = new TotalJudge(total_judge)
    }

    notes() {
        return this.total_judge.notes()
    }
}

export class TotalJudge {
    constructor(total_judge) {
        this.early_pgreat = total_judge.early_pgreat
        this.late_pgreat = total_judge.late_pgreat
        this.early_great = total_judge.early_great
        this.late_great = total_judge.late_great
        this.early_good = total_judge.early_good
        this.late_good = total_judge.late_good
        this.early_bad = total_judge.early_bad
        this.late_bad = total_judge.late_bad
        this.early_poor = total_judge.early_poor
        this.late_poor = total_judge.late_poor
        this.early_miss = total_judge.early_miss
        this.late_miss = total_judge.late_miss
    }

    notes() {
        return this.early_pgreat + this.early_great + this.early_good + this.late_pgreat + this.late_great + this.late_good
    }
}