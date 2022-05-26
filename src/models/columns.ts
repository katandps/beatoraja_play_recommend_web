interface IColumns {
  clear?:  boolean,
  clear_date?:  boolean,
  clear_before?:  boolean,
  level?:  boolean,
  title?: boolean,
  rate?:  boolean,
  score_rank?: boolean,
  detail_rank?: boolean,
  score?:  boolean,
  score_date?: boolean,
  score_before?:  boolean,
  bp?: boolean,
  bp_date?:  boolean,
  bp_before?:  boolean,
  combo?:  boolean,
  play?: boolean,
  date?:  boolean,

  clear_update?: boolean,
  rank_update?:  boolean,
  score_update?:  boolean,
  bp_update?: boolean,

  clear_diff_rival?: boolean,
  score_diff_rival?:  boolean,
  bp_diff_rival?:  boolean,
  rival_date?:  boolean
}

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
    
      clear_update: false,
      rank_update:  false,
      score_update:  false,
      bp_update: false,
    
      clear_diff_rival: false,
      score_diff_rival:  false,
      bp_diff_rival:  false,
      rival_date:  false
    }
  }

  constructor(columns: IColumns) {
    this.columns = Columns.columns_default()
    Object.assign(this.columns, columns)
  }

  static for_rival = () => (new Columns({
    clear_diff_rival: true,
    score_diff_rival: true,
    bp_diff_rival: true,
    rival_date: true
  }))

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

  for_recent() {
    this.columns.clear_update = true
    this.columns.score = false
    this.columns.score_date = false
    this.columns.score_update = true
    this.columns.score_rank = false
    this.columns.rank_update = true
    this.columns.bp = false
    this.columns.bp_date = false
    this.columns.bp_update = true
  }

  for_rival() {

  }

  /**
   * カラムを表示すべきかどうかを返す
   * @param {string} column_name
   * @return boolean
   */
  column_is_active(column_name: string): boolean {
    return !!this.columns[column_name]
  }

  visible_columns(): string[] {
    const ret: string[] = [];
    Object.entries(this.columns).filter((a) => {
      a[1] ? ret.push(a[0]) : null})
    return ret
  }

  import_columns(cols: string[]) {
    this.columns = {}
    cols.forEach((c) => this.columns[c] = true)
  }
}
