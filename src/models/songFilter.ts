import config from "../const"
import { DateFormatter } from "./date_formatter"
import * as log from "loglevel"
import Columns from "./columns"
import SongDetail from "./song_detail"

export default class SongFilter {
  sort_desc: boolean = false
  sort_key: string = "title"
  columns: Columns = new Columns({})
  visible_lamp: VisibleLamp = new VisibleLamp({})
  visible_rank: VisibleRank = new VisibleRank({})
  day_until: number = 0
  day_since: number = 365 * 100
  max_length: number = 100

  constructor(filter: any) {
    log.debug("filter constructed by ", filter)
    if (filter) {
      this.sort_desc = filter.sort_desc
      this.sort_key = filter.sort_key
      this.columns = new Columns(filter.columns)
      this.visible_lamp = new VisibleLamp(filter.visible_lamp)
      this.visible_rank = new VisibleRank(filter.visible_rank)
      this.day_until = filter.day_until
      this.max_length = filter.max_length
    }
  }

  set_sort(key: string) {
    if (this.sort_key === key) {
      this.sort_desc = !this.sort_desc
    }
    this.sort_key = key
  }

  set_columns(columns: Columns) {
    if (!columns) {
      return
    }
    this.columns = columns
  }

  /**
   * ヘッダーに使えるクラス名を得る
   * @public
   * @param {string} key
   * @return {"sort_active" | "sort_inactive"}
   */
  sort_key_is_active(key: string) {
    if (this.sort_key === key) {
      return "sort_active"
    } else {
      return "sort_inactive"
    }
  }

  visible_reverse() {
    VisibleLamp.reverse(this.visible_lamp)
  }

  visible_all_lamp_type() {
    this.visible_lamp.to_all()
  }

  visible_not_full_combo() {
    this.visible_lamp.to_not_full_combo()
  }

  visible_not_ex_hard() {
    this.visible_lamp.to_not_ex_hard()
  }

  visible_not_hard() {
    this.visible_lamp.to_not_hard()
  }

  visible_not_easy() {
    this.visible_lamp.to_not_easy()
  }

  filter_all_term() {
    this.day_until = 0
  }

  filter_older_half_year() {
    this.day_until = 180
  }

  filter_older_one_year() {
    this.day_until = 365
  }

  filter_older_two_year() {
    this.day_until = 730
  }

  /**
   * @public
   * @param {SongDetail} song
   * @return boolean
   */
  apply(song: SongDetail) {
    return (
      this.visible_lamp.lamps[song.clear_type] &&
      this.visible_rank.ranks[song.clear_rank] &&
      this.viewable_date(song.updated_at.split("T")[0])
    )
  }

  viewable_date(formatted_date: string): boolean {
    const until_date = new Date()
    until_date.setDate(until_date.getDate() - this.day_until)
    const since_date = new Date()
    since_date.setDate(since_date.getDate() - this.day_since)
    // debug(DateFormatter.format(since_date), DateFormatter.format(until_date), formatted_date)
    return DateFormatter.format(until_date) >= formatted_date && DateFormatter.format(since_date) <= formatted_date
  }

  default() {
    Object.assign(this, new SongFilter(null))
  }

  for_recent() {
    this.sort_key = "date"
    this.sort_desc = true
    // this.day_since=7
    this.day_until = 0
    this.columns.for_recent()
  }

  for_rival() {
    this.sort_key = "score_diff_rival"
    this.sort_desc = true
    this.columns.for_rival()
  }

  /**
   * @public
   */
  for_random() {
    this.sort_key = "" //連続押し対応
    this.sort_key = "random_select"
    this.sort_desc = false
    this.day_until = 0
  }

  /**
   * @public
   */
  for_score() {
    this.sort_key = "score_date"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_score()
    this.visible_all_lamp_type()
    this.visible_rank.to_all()
  }

  /**
   * @public
   */
  for_bp() {
    this.sort_key = "bp_date"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_bp()
    this.visible_all_lamp_type()
    this.visible_rank.to_all()
  }

  /**
   * @public
   */
  for_aaa() {
    this.sort_key = "rate"
    this.sort_desc = true
    this.day_until = 0
    this.columns.for_score()
    this.visible_all_lamp_type()
    this.visible_rank.to_not_aaa()
  }

  /**
   * @public
   */
  for_aa() {
    this.sort_key = "rate"
    this.sort_desc = true
    this.day_until = 0
    this.columns.for_score()
    this.visible_all_lamp_type()
    this.visible_rank.to_not_aa()
  }

  /**
   * @public
   */
  for_easy() {
    this.sort_key = "bp"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_bp()
    this.visible_not_easy()
    this.visible_rank.to_all()
  }

  /**
   * @public
   */
  for_hard() {
    this.sort_key = "bp"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_bp()
    this.visible_not_hard()
    this.visible_rank.to_all()
  }

  /**
   * @public
   */
  for_ex_hard() {
    this.sort_key = "bp"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_bp()
    this.visible_not_ex_hard()
    this.visible_rank.to_all()
  }

  /**
   * @public
   */
  for_full_combo() {
    this.sort_key = "bp"
    this.sort_desc = false
    this.day_until = 0
    this.columns.for_bp()
    this.visible_not_full_combo()
    this.visible_rank.to_all()
  }

  visible_columns(): string[] {
    return this.columns.visible_columns()
  }
}

interface IVisibleLamp {
  lamps?: boolean[]
}

class VisibleLamp {
  lamps: boolean[] = [false, false, false, false, false, false, false, false, false, false]
  constructor(lamp: IVisibleLamp) {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      this.lamps[i] = true
    }
    Object.assign(this, lamp)
  }

  static reverse(self: VisibleLamp) {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      self.lamps[i] = !self.lamps[i]
    }
  }

  to_all() {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      this.lamps[i] = true
    }
  }

  to_not_full_combo() {
    this.to_all()
    this.lamps[10] = false
    this.lamps[9] = false
    this.lamps[8] = false
  }

  to_not_ex_hard() {
    this.to_not_full_combo()
    this.lamps[7] = false
  }

  to_not_hard() {
    this.to_not_ex_hard()
    this.lamps[6] = false
  }

  to_not_easy() {
    this.to_not_hard()
    this.lamps[5] = false
    this.lamps[4] = false
  }
}

interface IVisibleRank {
  ranks?: { [k: string]: boolean }
}

class VisibleRank {
  ranks: { [k: string]: boolean } = {
    Max: true,
    AAA: true,
    AA: true,
    A: true,
    B: true,
    C: true,
    D: true,
    E: true,
    F: true,
  }

  constructor(rank: IVisibleRank) {
    this.ranks.Max = true
    this.ranks.AAA = true
    this.ranks.AA = true
    this.ranks.A = true
    this.ranks.B = true
    this.ranks.C = true
    this.ranks.D = true
    this.ranks.E = true
    this.ranks.F = true
    Object.assign(this.ranks, rank)
  }

  to_all() {
    config.RANK_TYPE.forEach((type: string) => (this.ranks[type] = true))
  }

  to_not_aaa() {
    this.to_all()
    this.ranks.Max = false
    this.ranks.AAA = false
  }

  to_not_aa() {
    this.to_not_aaa()
    this.ranks.AA = false
  }
}
