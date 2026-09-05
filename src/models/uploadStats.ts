import { DateFormatter } from "./date_formatter"

export default class UploadStats {
    uploads: UploadStat[]

    constructor(json: any) {
        this.uploads = []
        if (json.uploads) {
            json.uploads.reverse().forEach((t:any) => this.uploads.push(
                new UploadStat(
                    t.upload_id,
                    t.upload_at
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

    constructor(upload_id: number, upload_at: string) {
        this.upload_id = upload_id
        this.upload_at = DateFormatter.format(new Date(upload_at))        
    }
}