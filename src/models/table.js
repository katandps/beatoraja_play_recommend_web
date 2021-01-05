import Api from "../api";
import * as log from "loglevel"

export default class Tables {
    /**
     * @param {Object[]} json
     */
    constructor(json) {
        this.tables = [];
        json.forEach(t => this.tables.push(new Table(t.name, t.levels)))
    }

    /**
     * @param token
     * @returns {Tables}
     */
    static async init(token) {
        const json = await Api.fetch_tables(token)
        log.debug(json)
        return new Tables(json)
    }

    /**
     * @public
     * @returns {string[]}
     */
    name_list() {
        return this.tables.map(t => t.name)
    }

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
                return i;
            }
        }
        return 0;
    }

    /**
     * @param table_name
     * @returns {Table|null}
     */
    get_table(table_name) {
        return this.tables[this.table_index(table_name)] || null;
    }
}

export class Table {
    constructor(name, levels) {
        this.name = name;
        this.levels = levels;
    }
}
