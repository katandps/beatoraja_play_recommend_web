import { DateFormatter } from "./date_formatter"
import { TotalJudge } from "./playStats"

export default class UploadStats {
    uploads: UploadStat[]

    constructor(json: any) {
        this.uploads = []
        const uploads = Array.isArray(json) ? json : []
        if (uploads) {
            uploads.forEach((t:any) => this.uploads.push(
                new UploadStat(
                    t.upload_id,
                    t.upload_at,
                    t.song_count,
                    t.stats,
                    t.total_stats
                )))
        }
    }

    /**
     * @public
     * @returns {UploadStats}
     */
    static default() {
        return new UploadStats({uploads:[]})
    }
}


export class UploadStat {
    upload_id: number
    upload_at: string
    song_count: number
    stats: UploadPlayStats
    total_stats: UploadPlayStats

    constructor(upload_id: number, upload_at: string, song_count: number, stats: any, total_stats: any) {
        this.upload_id = upload_id
        this.upload_at = DateFormatter.format(new Date(upload_at))
        this.song_count = song_count
        this.stats = new UploadPlayStats(stats)
        this.total_stats = new UploadPlayStats(total_stats)
    }
}

export class UploadPlayStats {
    play_count: number
    clear_count: number
    play_time: number
    total_judge: TotalJudge

    constructor(stats: any) {
        this.play_count = stats?.play_count || 0
        this.clear_count = stats?.clear_count || 0
        this.play_time = stats?.play_time || 0
        this.total_judge = new TotalJudge(stats?.total_judge || {})
    }

    notes() {
        return this.total_judge.notes()
    }
}