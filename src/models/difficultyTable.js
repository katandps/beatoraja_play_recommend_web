export default class Tables {
  /**
   * @param {Object[]} json
   */
  constructor(json) {
    /**
     * @type {DifficultyTable[]}
     */
    this.tables = []
    json.forEach((t) =>
      this.tables.push(new DifficultyTable(t.name, t.levels, t.level_list))
    )
  }

  /**
   * @public
   * @returns {string[]}
   */
  name_list() {
    return this.tables.map((t) => t.name)
  }

  /**
   * @returns {null|DifficultyTable}
   */
  first() {
    return this.tables.length === 0 ? null : this.tables[0]
  }

  /**
   * @private
   * @param table_name
   * @returns {number}
   */
  table_index(table_name) {
    for (let i = 0; i < this.tables.length; i++) {
      if (this.tables[i].name === table_name) {
        return i
      }
    }
    return -1
  }

  /**
   * @param table_name
   * @returns {DifficultyTable|null}
   */
  get_table(table_name) {
    return this.tables[this.table_index(table_name)] || null
  }
}

export class DifficultyTable {
  constructor(name, levels, level_list) {
    /**
     * @type string
     */
    this.name = name
    /**
     * @type {Object.<string, string[]>} level_label: hash[]
     */
    this.levels = levels
    /**
     * @type string[]
     */
    this.level_list = level_list
    /**
     * @type {Object.<string, Object.<string, SongDetail>>}
     */
    this.table_score = {}
    this.level_list.forEach((level) => (this.table_score[level] = {}))
  }

  /**
   * @public
   * @param {string} table_name
   * @returns {boolean}
   */
  contains_level(table_name) {
    return this.level_list.indexOf(table_name) !== -1
  }
}
