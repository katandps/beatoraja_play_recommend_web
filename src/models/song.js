export default class Song {
    /**
     * @param {{title: string, notes: number, sha256: string, md5: string}} song
     */
    constructor(song) {
        /**
         * @type string
         */
        this.title = song.title
        /**
         * @type number
         */
        this.notes = song.notes
        /**
         * @type string
         */
        this.sha256 = song.sha256
        /**
         * @type string
         */
        this.md5 = song.md5
    }
}
