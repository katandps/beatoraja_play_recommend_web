import Song from "./song";

export default class Songs {

    songs: {[value: string]: Song} = {}
    /**
     * @param {{title: string, notes: number, sha256: string, md5: string}[]}songs
     */
    constructor(songs: {md5: string}[]) {
        for (const song of songs) {
            this.songs[song.md5] = new Song(song)
        }
    }

    get_score(hash: string): Song {
        return this.songs[hash]
    }
}