export default class Tables {
  tables: DifficultyTable[]

  constructor(json: any) {
    /**
     * @type {DifficultyTable[]}
     */
    this.tables = []
    json.forEach((t: any) =>
      this.tables.push(new DifficultyTable(t.name, t.levels, t.level_list))
    )
  }

  name_list(): string[] {
    return this.tables.map((t) => t.name)
  }

  /**
   * @returns {null|DifficultyTable}
   */
  first() {
    return this.tables.length === 0 ? null : this.tables[0]
  }

  table_index(table_name: string): number {
    for (let i = 0; i < this.tables.length; i++) {
      if (this.tables[i].name === table_name) {
        return i
      }
    }
    return -1
  }

  level_list(): string[] {
    let ret: string[] = [];
    for (const table of this.tables) {
      ret = ret.concat(table.level_list)
    }
    return ret    
  }

  /**
   * @param table_name
   * @returns {DifficultyTable|null}
   */
  get_table(table_name: string) {
    return this.tables[this.table_index(table_name)] || null
  }
}

export class DifficultyTable {
  name: string
  levels: {[level: string]: string[]}
  level_list: string[]
  checks: string[]

  constructor(table_name: string, levels: {[level: string]: string[]}, level_list: string[]) {
    this.name = table_name
    /**
     * @type {Object.<string, string[]>} level_label: hash[]
     */
    this.levels = levels
    /**
     * @type string[]
     */
    this.level_list = level_list

    this.checks = []
  }

  setChecks(checks: string[]) {
    console.log(this, checks)
    this.checks = checks
  }
}
