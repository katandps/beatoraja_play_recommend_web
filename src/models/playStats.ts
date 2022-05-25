import {DateFormatter} from "@/models/date_formatter";

export default class PlayStats {
    logs: PlayStat[]
    /**
     * @param {{log: [{play_count: number, clear_count: number, play_time: number, date: Date, total_judge: {}}]}} json
     */
    constructor(json: any) {
        this.logs = []
        if (json.log) {
              json.log.reverse().forEach((t:any) => this.logs.push(
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
    play_count: number
    clear_count: number
    play_time: number
    date: string
    total_judge: TotalJudge

    constructor(play_count: number, clear_count:number, play_time:number, date:string, total_judge: any) {
        this.play_count = play_count
        this.clear_count = clear_count
        this.play_time = play_time
        this.date = DateFormatter.format(new Date(date))
        this.total_judge = new TotalJudge(total_judge)
    }

    /**
     * @return {string} h:m:s
     */
    time() {
        return "" + ~~(this.play_time / 3600)
            + ":" + ('0' + ~~(this.play_time / 60 % 60)).slice(-2)
            + ":" + ('0' + ~~(this.play_time % 60)).slice(-2)
    }

    notes() {
        return this.total_judge.notes()
    }
}

export class TotalJudge {
    early_pgreat: number
    late_pgreat: number
    early_great: number
    late_great: number
    early_good: number
    late_good:number
    early_bad:number
    late_bad: number
    early_poor: number 
    late_poor: number
    early_miss: number
    late_miss: number

    constructor(total_judge: any) {
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