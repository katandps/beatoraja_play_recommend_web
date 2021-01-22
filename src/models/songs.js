import Song from "./song";

export default class Songs {
    /**
     * @param {{title: string, notes: number, sha256: string, md5: string}[]}songs
     */
    constructor(songs) {

        let obj = {};
        for (const song of songs) {
            obj[song.md5] = new Song(song)
        }

        /**
         * @type {Object.<string, Song>}
         */
        this.songs = obj
    }

    /**
     * @param {string} hash
     * @returns {Song}
     */
    get_score(hash) {
        return this.songs[hash]
    }
}