import Tables, { ActivatedTables } from "./difficultyTable";
import Scores from "./scores";
import Song from "./song";
import SongDetail from "./song_detail";
import SongFilter from "./songFilter";

export default class Songs {

    songs: { [value: string]: Song } = {}
    /**
     * @param {{title: string, notes: number, sha256: string, md5: string}[]}songs
     */
    constructor(songs: { md5: string }[]) {
        for (const song of songs) {
            this.songs[song.md5] = new Song(song)
        }
    }

    get_song(hash: string): Song {
        return this.songs[hash]
    }

    generate_song_detail_list(tables: Tables, scores: Scores): SongDetail[] {
        const ret = []
        const used: { [key: string]: boolean } = {}
        for (let table_index = 0; table_index < tables.tables.length; table_index += 1) {
            const table = tables.tables[table_index]
            for (const level in table.levels) {
                // all difficulties are viewable 
                const hashes = table.levels[level]
                if (!hashes) {
                    continue
                }

                for (const hash of hashes) {
                    if (used[hash]) {
                        continue
                    }
                    used[hash] = true
                    if (!scores.score_exists(hash)) {
                        continue
                    }
                    const score = new SongDetail()
                    score.set_level(level)
                    score.init_score(scores.get_score(hash))
                    score.init_song(this.get_song(hash), hash)

                    ret.push(score)
                }
            }
        }
        return ret
    }

    generate_song_detail_list_with_filter(tables: Tables, scores: Scores, filter: SongFilter, checked_tables: ActivatedTables, exists_rival_score: boolean, rival_score: Scores): SongDetail[] {
        const ret = []
        const used: { [key: string]: boolean } = {}
        for (let table_index = 0; table_index < tables.tables.length; table_index += 1) {
            const table = tables.tables[table_index]
            for (const level in table.levels) {
                if (!ActivatedTables.is_active(checked_tables, table, level)) {
                    continue;
                }
                const hashes = table.levels[level]
                if (!hashes) {
                    continue
                }

                for (const hash of hashes) {
                    if (used[hash]) {
                        continue
                    }
                    used[hash] = true
                    const score = new SongDetail()
                    score.set_level(level)
                    score.init_score(scores.get_score(hash))
                    score.init_song(this.get_song(hash), hash)
                    if (exists_rival_score) {
                        score.init_rival_score(rival_score?.get_score(hash))
                    }
                    if (filter.apply(score, exists_rival_score)) {
                        ret.push(score)
                    }
                }
            }
        }
        return ret
    }
}