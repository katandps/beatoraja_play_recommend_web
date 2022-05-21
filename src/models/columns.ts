export default class Columns {
  columns: {[key: string]: boolean}

  static columns_default(): {[key: string]: boolean} {
    return {
      clear:  true,
      clear_date:  false,
      clear_before:  false,
      level:  true,
      title: true,
      rate:  true,
      score_rank: true,
      detail_rank: false,
      score:  true,
      score_date: false,
      score_before:  false,
      bp: true,
      bp_date:  false,
      bp_before:  false,
      combo:  true,
      play: true,
      date:  true,
    
      clear_update: true,
      rank_update:  true,
      score_update:  true,
      bp_update: true,
    
      clear_diff_rival: true,
      score_diff_rival:  true,
      bp_diff_rival:  true,
      rival_date:  true
    }
  }

  constructor(columns: Object) {
    this.columns = Columns.columns_default()
    Object.assign(this, columns)
  }

  for_score() {
    this.columns = Columns.columns_default()
    this.columns.score_date = true
    this.columns.score_before = true
  }

  for_bp() {
    this.columns = Columns.columns_default()
    this.columns.bp_date = true
    this.columns.bp_before = true
  }

  /**
   * カラムを表示すべきかどうかを返す
   * @param {string} column_name
   * @return boolean
   */
  column_is_active(column_name: string): boolean {
    return !!this.columns[column_name]
  }
}
