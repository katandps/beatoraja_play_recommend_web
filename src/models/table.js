export default class Tables {
    constructor(tables) {
        this.tables = [];
        tables.forEach(t => this.tables.push(new Table(t.name, t.levels)))
        this.selected_table = this.tables.length > 0 ? this.tables[0].name : "";
    }

    list() {
        return this.tables;
    }

    table_index() {
        for (let i = 0; i < this.tables.length; i++) {
            if (this.tables[i].name === this.selected_table) {
                return i;
            }
        }
        return -1;
    }

    get_table() {
        return this.tables[this.table_index()] || null;
    }
}

export class Table {
    constructor(name, levels) {
        this.name = name;
        this.levels = levels;
    }
}
