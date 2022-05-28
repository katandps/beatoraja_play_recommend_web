import config from "../const"
import Score from "./score"
import Song from "./song"

export default class SongDetail {

  title: string = "曲データなし"
  total_notes: number = 0
  md5: string = ""
  sha256: string = ""

  clear_rank: string = SongDetail.make_clear_rank(0, 0)
  rival_clear_rank: string

  score: number
  rival_score: number
  score_before: number
  score_updated_at: string

  min_bp: number
  min_bp_before: number
  rival_min_bp: number
  min_bp_updated_at: string

  play_count: number
  max_combo: number
  rival_max_combo: number


  clear_type: number
  rival_clear_type: number
  clear_type_before: number
  clear_updated_at: string

  level: string = ""

  updated_at: string = ""
  rival_updated_at: string

  mode: number

  constructor() {
    const score = new Score()
    this.max_combo = score.max_combo

    this.clear_type = score.clear_type
    this.clear_type_before = score.clear_type_before
    this.clear_updated_at = score.clear_updated_at

    this.score = score.score
    this.score_before = score.score_before
    this.score_updated_at = score.score_updated_at

    this.min_bp = score.min_bp
    this.min_bp_before = score.min_bp_before
    this.min_bp_updated_at = score.min_bp_updated_at

    this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
    this.updated_at = score.updated_at
    this.play_count = score.play_count
    this.mode = 0

    this.rival_max_combo = score.max_combo
    this.rival_clear_type = score.clear_type
    this.rival_score = score.score
    this.rival_min_bp = score.min_bp
    this.rival_clear_rank = SongDetail.make_clear_rank(
      this.total_notes,
      this.rival_score
    )
    this.rival_updated_at = score.updated_at
  }

  init_song(song: Song, hash: string) {
    if (!song) {
      this.md5 = hash
      return
    }
    this.title = song.title
    this.total_notes = song.notes
    this.md5 = song.md5
    this.sha256 = song.sha256

    this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
  }

  init_score(score: Score) {
    this.max_combo = score.max_combo

    this.clear_type = score.clear_type
    this.clear_type_before = score.clear_type_before
    this.clear_updated_at = score.clear_updated_at

    this.score = score.score
    this.score_before = score.score_before
    this.score_updated_at = score.score_updated_at

    this.min_bp = score.min_bp
    this.min_bp_before = score.min_bp_before
    this.min_bp_updated_at = score.min_bp_updated_at

    this.clear_rank = SongDetail.make_clear_rank(this.total_notes, this.score)
    this.updated_at = score.updated_at
    this.play_count = score.play_count
  }

  init_rival_score(score: Score) {
    this.rival_max_combo = score.max_combo
    this.rival_clear_type = score.clear_type
    this.rival_score = score.score
    this.rival_min_bp = score.min_bp
    this.rival_clear_rank = SongDetail.make_clear_rank(
      this.total_notes,
      this.rival_score
    )
    this.rival_updated_at = score.updated_at
  }

  static make_clear_rank(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return config.RANK_TYPE.slice(-1)[0]
    }
    const max = total_notes * 2
    return config.RANK_TYPE[
      config.RANK_RATE_BY_9.findIndex((v) => ~~((v * max + 8) / 9) <= ex_score)
    ]
  }

  static make_next_rank(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return config.RANK_TYPE.slice(-1)[0]
    }
    const max = total_notes * 2
    const i = config.RANK_RATE_BY_9.findIndex(
      (v) => ~~((v * max + 8) / 9) <= ex_score
    )
    return config.RANK_TYPE[i == 0 ? 0 : i - 1]
  }

  static make_next_rank_score(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return 0
    }
    const max = total_notes * 2
    const i = config.RANK_RATE_BY_9.findIndex(
      (v) => ~~((v * max + 8) / 9) <= ex_score
    )
    return (
      ~~((config.RANK_RATE_BY_9[i == 0 ? 0 : i - 1] * max + 8) / 9) - ex_score
    )
  }

  static make_detail_rank(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return config.DETAIL_RANK_TYPE.slice(-1)[0]
    }
    const max = total_notes * 2
    return config.DETAIL_RANK_TYPE[
      config.DETAIL_RANK_BY_27.findIndex(
        (v) => ~~((v * max + 26) / 27) <= ex_score
      )
    ]
  }

  static make_next_detail_rank(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return config.DETAIL_RANK_TYPE.slice(-1)[0]
    }
    const max = total_notes * 2
    const i = config.DETAIL_RANK_BY_27.findIndex(
      (v) => ~~((v * max + 26) / 27) <= ex_score
    )
    return config.DETAIL_RANK_TYPE[i == 0 ? 0 : i - 1]
  }

  static make_next_detail_rank_score(total_notes: number, ex_score: number) {
    if (!total_notes) {
      return 0
    }
    const max = total_notes * 2
    const i = config.DETAIL_RANK_BY_27.findIndex(
      (v) => ~~((v * max + 26) / 27) <= ex_score
    )
    return (
      ~~((config.DETAIL_RANK_BY_27[i == 0 ? 0 : i - 1] * max + 26) / 27) -
      ex_score
    )
  }

  /**
   * @public //データがないときに使う
   * @return SongDetail
   */
  static dummy() {
    return Object.assign(new SongDetail(), config.SONG_FORMAT[0][0].songs)
  }

  score_rate() {
    if (this.total_notes === 0) {
      return 0.0
    }
    return (this.score / this.total_notes) * 50
  }

  set_level(level: string) {
    this.level = level
  }

  static cmp_title(a: SongDetail, b: SongDetail) {
    if (a.title === b.title) {
      return 0
    }
    return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
  }

  static cmp(a: SongDetail, b: SongDetail, key: string, desc: boolean, level_list: string[]): number {
    const valA = a.sort_key(key, level_list)
    const valB = b.sort_key(key, level_list)
    return valA === valB ? 0 : (valA < valB) !== desc ? -1 : 1
  }
  /**
   * @public
   * @param {string} sort_key
   * @param {string[]} level_list
   * @returns {string|string|*|number}
   */
  sort_key(sort_key: string, level_list: string[]) {
    switch (sort_key) {
      case "level":
        return level_list.indexOf(this.level)
      case "clear":
        return this.clear_type
      case "title":
        return this.title.toLowerCase()
      case "rate":
        return this.score_rate()
      case "score_rank":
        return this.score_rate()
      case "detail_rank":
        return this.score_rate()
      case "score":
        return this.score
      case "bp":
        return this.min_bp
      case "combo":
        return this.max_combo
      case "play":
        return this.play_count
      case "date":
        return this.updated_at
      case "score_before":
        return this.score_before
      case "score_date":
        return this.score_updated_at
      case "bp_date":
        return this.min_bp_updated_at
      case "bp_before":
        return this.min_bp_before
      case "clear_date":
        return this.clear_updated_at
      case "clear_before":
        return this.clear_type_before
      case "clear_diff_rival":
        return this.clear_type - this.rival_clear_type
      case "score_diff_rival":
        return this.score - this.rival_score
      case "bp_diff_rival": {
        const min_bp = this.min_bp === -1 ? this.total_notes : this.min_bp
        const rival =
          this.rival_min_bp === -1 ? this.total_notes : this.rival_min_bp
        return rival - min_bp
      }
      case "rival_date":
        return this.rival_updated_at
      case "random_select":
        return Math.floor(Math.random() * Math.floor(100000000))
      default:
        return 0
    }
  }

  get(type: string) {
    switch (type) {
      case "clear":
        return ""
      case "clear_type_index":
        return this.clear_type
      case "clear_type":
        return config.LAMP_INDEX[this.clear_type]
      case "rival_clear_type":
        return config.LAMP_INDEX[this.rival_clear_type]
      case "title":
        return this.title
      case "level":
        return this.level
      case "notes":
        return this.total_notes
      case "rate":
        return score_format(this.total_notes, this.score)
      case "rival_rate":
        return score_format(this.total_notes, this.rival_score)
      case "score_rank":
        return SongDetail.make_clear_rank(this.total_notes, this.score)
      case "next_rank":
        return SongDetail.make_next_rank(this.total_notes, this.score)
      case "next_rank_score":
        return SongDetail.make_next_rank_score(this.total_notes, this.score)
      case "detail_rank":
        return SongDetail.make_detail_rank(this.total_notes, this.score)
      case "next_detail_rank":
        return SongDetail.make_next_detail_rank(this.total_notes, this.score)
      case "next_detail_rank_score":
        return SongDetail.make_next_detail_rank_score(
          this.total_notes,
          this.score
        )
      case "rival_rank":
        return SongDetail.make_clear_rank(this.total_notes, this.rival_score)
      case "score":
        return `${this.score}/${this.total_notes * 2}`
      case "score_rate":
        return this.total_notes === 0 ? 0 : this.score / this.total_notes / 2
      case "rival_score":
        return this.rival_score
      case "score_before":
        return this.score_before
      case "score_date":
        return this.score_updated_at.split("T")[0]
      case "bp":
        return this.min_bp === -1 ? "---" : this.min_bp
      case "rival_bp":
        return this.rival_min_bp
      case "bp_before":
        return this.min_bp_before === -1 ? "---" : this.min_bp_before
      case "bp_date":
        return this.min_bp_updated_at.split("T")[0]
      case "clear_before":
        return ""
      case "clear_type_before":
        return config.LAMP_INDEX[this.clear_type_before]
      case "clear_date":
        return this.clear_updated_at.split("T")[0]
      case "combo":
        return this.max_combo
      case "rival_combo":
        return this.rival_max_combo
      case "combos":
        return `${this.max_combo}/${this.total_notes}`
      case "combo_rate":
        return this.total_notes === 0 ? 0 : this.max_combo / this.total_notes
      case "play":
        return this.play_count === -1 ? "---" : this.play_count
      case "date":
        return this.updated_at.split("T")[0] === "1970-01-01"
          ? "---"
          : this.updated_at.split("T")[0]
      case "viewer":
        return (
          '<a href="http://www.ribbit.xyz/bms/score/view?md5=' +
          this.md5 +
          '" target="_blank">Viewer</a>'
        )
      case "minir":
        return (
          '<a href="https://www.gaftalk.com/minir/#/viewer/song/' +
          this.sha256 +
          "/" +
          this.mode +
          '" target="_blank">MinIR</a>'
        )
      case "mocha":
        return (
          '<a href="https://mocha-repository.info/song.php?sha256=' +
          this.sha256 +
          '" target="_blank">Mocha</a>'
        )
      case "clear_diff_rival":
        return this.clear_type === this.rival_clear_type
          ? '<span class="draw">draw</span>'
          : this.clear_type < this.rival_clear_type
            ? '<span class="lose">lose</span>'
            : '<span class="win">win</span>'
      case "score_diff_rival": {
        const diff = this.score - this.rival_score
        const span_class = diff === 0 ? "draw" : diff > 0 ? "win" : "lose"
        return "<span class=" + span_class + ">" + diff + "</span>"
      }
      case "bp_diff_rival":
        if (this.rival_min_bp === -1 || this.min_bp === -1) {
          return "---"
        } else {
          const diff = this.min_bp - this.rival_min_bp
          const span_class = diff === 0 ? "draw" : diff > 0 ? "lose" : "win"
          return "<span class=" + span_class + ">" + diff + "</span>"
        }
      case "rival_date":
        return this.rival_updated_at.split("T")[0] === "1970-01-01"
          ? "---"
          : this.rival_updated_at.split("T")[0]
    }
  }
}

export const score_format = (total_notes: number, score: number): string => {
  if (total_notes === 0) {
    return "00.00"
  }
  if (score === total_notes * 2) {
    return "100.0"
  }
  return ((score / total_notes) * 50).toFixed(2)
}
