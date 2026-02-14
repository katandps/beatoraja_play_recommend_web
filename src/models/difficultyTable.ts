export default class Tables {
  tables: DifficultyTable[]

  static default(): Tables {
    return new Tables(JSON.parse("[]"))
  }

  constructor(json: any) {
    /**
     * @type {DifficultyTable[]}
     */
    this.tables = []
    json.forEach((t: any) =>
      this.tables.push(new DifficultyTable(t.name, t.id, t.levels, t.level_list))
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

  get_id_by_name(table_name: string): number {
    for (let i = 0; i < this.tables.length; i++) {
      if (this.tables[i].name === table_name) {
        return this.tables[i].id
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
}

export class DifficultyTable {
  name: string
  id: number
  levels: { [level: string]: string[] }
  level_list: string[]

  constructor(table_name: string, id: number, levels: { [level: string]: string[] }, level_list: string[]) {
    this.name = table_name
    this.id = id
    this.levels = levels
    this.level_list = level_list
  }
}

export class ActivatedTables {
  inactive: { [index: number]: ActivatedLevels } = {}

  static initialize(activated: ActivatedTables): void {
    for (const key in activated.inactive) {
      ActivatedLevels.initialize(activated.inactive[key])
    }
  }

  static check_all(activated: ActivatedTables, tables: Tables): void {
    if (!ActivatedTables.is_all_active(activated, tables)) {
      ActivatedTables.initialize(activated)
    } else {
      for (let index = 0; index < tables.tables.length; index++) {
        const levels = ActivatedTables.get(activated, tables.tables[index])
        ActivatedLevels.check_all(levels, tables.tables[index])
      }
    }
  }

  static is_all_active(activated: ActivatedTables, tables: Tables): boolean {
    for (let index = 0; index < tables.tables.length; index++) {
      const levels = ActivatedTables.get(activated, tables.tables[index])
      if (!ActivatedLevels.is_all_active(levels)) {
        return false
      }
    }
    return true
  }

  static contains_active(activated: ActivatedTables, tables: Tables): boolean {
    for (let index = 0; index < tables.tables.length; index++) {
      const levels = ActivatedTables.get(activated, tables.tables[index])
      if (ActivatedLevels.contains_active(levels, tables.tables[index])) {
        return true
      }
    }
    return false
  }

  static table_is_active(activated: ActivatedTables, table: DifficultyTable): boolean {
    return ActivatedLevels.contains_active(ActivatedTables.get(activated, table), table)
  }

  static is_active(activated: ActivatedTables, table: DifficultyTable, level: string): boolean {
    return ActivatedLevels.is_active(ActivatedTables.get(activated, table), level)
  }

  static get(activated: ActivatedTables, table: DifficultyTable): ActivatedLevels {
    if (!activated.inactive[table.id]) {
      activated.inactive[table.id] = new ActivatedLevels()
    }
    return activated.inactive[table.id]
  }

  static filter_active_tables(checks: ActivatedTables, tables: Tables): DifficultyTable[] {
    return tables.tables.filter(t => ActivatedTables.table_is_active(checks, t))
  }
}

export class ActivatedLevels {
  private inactive: string[] = [] // unchecked level names

  static initialize(activated: ActivatedLevels): void {
    activated.inactive = []
  }

  static checked_levels(checks: ActivatedLevels, table: DifficultyTable): string[] {
    const ret: string[] = []
    for (const level of table.level_list) {
      if (!ActivatedLevels.is_active(checks, level)) {
        ret.push(level)
      }
    }
    return ret
  }

  static is_all_active(checks: ActivatedLevels): boolean {
    return checks.inactive.length === 0
  }

  static is_active(checks: ActivatedLevels, level: string): boolean {
    return checks.inactive.indexOf(level) === -1
  }

  static change_active(checks: ActivatedLevels, level: string): void {
    if (ActivatedLevels.is_active(checks, level)) {
      ActivatedLevels.check(checks, level)
    } else {
      const index = checks.inactive.indexOf(level)
      if (index !== -1) {
        checks.inactive.splice(index, 1)
      }
    }
  }

  static contains_active(checks: ActivatedLevels, table: DifficultyTable): boolean {
    return checks.inactive.length < table.level_list.length
  }

  static check_all(checks: ActivatedLevels, table: DifficultyTable): void {
    if (ActivatedLevels.is_all_active(checks)) {
      table.level_list.forEach(level => ActivatedLevels.check(checks, level))
    } else {
      ActivatedLevels.initialize(checks)
    }
  }

  static check(checks: ActivatedLevels, level: string): void {
    checks.inactive.push(level)
  }
}