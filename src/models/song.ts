export default class Song {
    title: string
    notes: number
    sha256: string
    md5: string

    constructor(song: any) {
        this.title = song.title
        this.notes = song.notes
        this.sha256 = song.sha256
        this.md5 = song.md5
    }
}
