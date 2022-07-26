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
  levels: { [level: string]: string[] }
  level_list: string[]

  constructor(table_name: string, levels: { [level: string]: string[] }, level_list: string[]) {
    this.name = table_name
    this.levels = levels
    this.level_list = level_list
  }
}

export class CheckedTables {
  tables: { [index: number]: CheckedLevels } = {}
  static all_checked(checks: CheckedTables, tables: Tables): boolean {
    for (let index = 0; index < tables.tables.length; index++) {
      const table = tables.tables[index]
      const levels = CheckedTables.get(checks, index)
      if (!CheckedLevels.all_checked(levels, table)) {
        return false
      }
    }
    return true
  }

  static is_empty(checks: CheckedTables, tables: Tables): boolean {
    for (let index = 0; index < tables.tables.length; index++) {
      const levels = CheckedTables.get(checks, index)
      if (!CheckedLevels.is_empty(levels)) {
        return false
      }
    }
    return true
  }

  static table_is_active(checks: CheckedTables, table_index: number): boolean {
    if (!checks.tables[table_index]) { return false }
    return checks.tables[table_index].checks.length > 0
  }

  static is_checked(checks: CheckedTables, table_index: number, level: string): boolean {
    if (!checks.tables[table_index]) { return false }
    return CheckedLevels.is_checked(checks.tables[table_index], level)
  }

  static get(checks: CheckedTables, index: number): CheckedLevels {
    if (!checks.tables[index]) {
      checks.tables[index] = new CheckedLevels()
    }
    return checks.tables[index]
  }
}

export class CheckedLevels {
  checks: string[] = []

  static all_checked(checks: CheckedLevels, table: DifficultyTable): boolean {
    return table.level_list.length === checks.checks.length
  }

  static is_checked(checks: CheckedLevels, level: string): boolean {
    return checks.checks.indexOf(level) >= 0
  }

  static is_empty(checks: CheckedLevels): boolean {
    return checks.checks.length === 0
  }
}