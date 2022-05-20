import config from "../const.js"
import { DateFormatter } from "./date_formatter"
import * as log from "loglevel"
import Columns from "./columns"

export default class SongFilter {
  constructor(filter) {
    log.debug("filter constructed by ", filter)
    this.sort_desc = filter ? filter.sort_desc : true
    this.sort_key = filter ? filter.sort_key : "clear"
    this.columns = new Columns(filter ? filter.columns : null)
    this.visible_lamp = new VisibleLamp(filter ? filter.visible_lamp : null)
    this.visible_rank = new VisibleRank(filter ? filter.visible_rank : null)
    this.day_before = filter ? filter.day_before || 0 : 0
    this.max_length = filter ? filter.max_length || 200 : 200
    this.visible_all_levels = filter ? filter.visible_all_levels : false
  }

  /**
   * @public
   * @param {string} key
   */
  set_sort(key) {
    if (this.sort_key === key) {
      this.sort_desc = !this.sort_desc
    }
    this.sort_key = key
  }

  /**
   * @public
   * @param {Columns} columns
   */
  set_columns(columns) {
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
  sort_key_is_active(key) {
    if (this.sort_key === key) {
      return "sort_active"
    } else {
      return "sort_inactive"
    }
  }

  /**
   * カラムを表示すべきかどうかを返す
   * @param {string} column_name
   * @return boolean
   */
  column_is_active(column_name) {
    return this.columns[column_name]
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
    this.day_before = 0
  }

  filter_older_half_year() {
    this.day_before = 180
  }

  filter_older_one_year() {
    this.day_before = 365
  }

  filter_older_two_year() {
    this.day_before = 730
  }

  /**
   * @public
   * @param {SongDetail} song
   * @return boolean
   */
  apply(song) {
    return (
      this.visible_lamp[song.clear_type] &&
      this.visible_rank[song.clear_rank] &&
      this.viewable_date(song)
    )
  }

  /**
   * @private
   * @param {SongDetail} song_detail
   * @returns {boolean}
   */
  viewable_date(song_detail) {
    let date = new Date()
    date.setDate(date.getDate() - this.day_before)
    return DateFormatter.format(date) >= song_detail.updated_at.split("T")[0]
  }

  /**
   * @public
   */
  for_random() {
    this.sort_key = "" //連続押し対応
    this.sort_key = "random_select"
    this.sort_desc = false
    this.day_before = 0
  }

  /**
   * @public
   */
  for_score() {
    this.sort_key = "score_date"
    this.sort_desc = false
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
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
    this.day_before = 0
    this.columns.for_bp()
    this.visible_not_full_combo()
    this.visible_rank.to_all()
  }
}

class VisibleLamp {
  constructor(lamp) {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      this[i] = true
    }
    Object.assign(this, lamp)
  }

  static reverse(self) {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      self[i] = !self[i]
    }
  }

  to_all() {
    for (let i = 0; i < config.LAMP_TYPE.length; i += 1) {
      this[i] = true
    }
  }

  to_not_full_combo() {
    this.to_all()
    this[10] = false
    this[9] = false
    this[8] = false
  }

  to_not_ex_hard() {
    this.to_not_full_combo()
    this[7] = false
  }

  to_not_hard() {
    this.to_not_ex_hard()
    this[6] = false
  }

  to_not_easy() {
    this.to_not_hard()
    this[5] = false
    this[4] = false
  }
}

class VisibleRank {
  constructor(rank) {
    this.Max = true
    this.AAA = true
    this.AA = true
    this.A = true
    this.B = true
    this.C = true
    this.D = true
    this.E = true
    this.F = true
    Object.assign(this, rank)
  }

  to_all() {
    config.RANK_TYPE.forEach((type) => (this[type] = true))
  }

  to_not_aaa() {
    this.to_all()
    this.Max = false
    this.AAA = false
  }

  to_not_aa() {
    this.to_not_aaa()
    this.AA = false
  }
}
