import Filter from "./filter";
import Tables from "./table";
import * as log from "loglevel";

export default class Model {
    /**
     * @constructor
     * @param {Tables} tables
     * @public
     */
    constructor(tables) {
        /**
         * @private
         * @type {Filter}
         */
        this.filter = new Filter()

        /**
         * @private
         * @type {Tables}
         */
        this.tables = tables
        this.selected_table = this.tables.get_table("")
        this.songs = null
    }

    /**
     * @public
     * @param token  APIアクセスに使用するトークン
     * @returns {Tables}
     */
    static async init(token) {
        return new Model(await Tables.init(token))
    }

    /**
     * @public
     * @returns {string[]}
     */
    get_table_names() {
        log.debug(this)
        return this.tables.name_list()
    }

    /**
     * @public
     * @param {string} table_name 設定するテーブル名
     */
    set_table(table_name) {
        this.selected_table = this.tables.get_table(table_name)
    }
}