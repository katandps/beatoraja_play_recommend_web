import Columns from '@/models/columns'
import { CheckedTables } from '@/models/difficultyTable'
import SongFilter from '@/models/songFilter'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore(
    {
        id: 'filter',
        persist: {
            enabled: true,
            strategies: [
                { key: 'filter', storage: localStorage }
            ]
        },
        state: () => ({
            filter: new SongFilter(null),
            checked_tables: new CheckedTables()
        }),
        actions: {
            setSort(column_name: string) {
                this.filter.set_sort(column_name)
            },
            setColumns(columns: Columns) {
                this.filter.set_columns(columns)
            },
            setLength(length: number) {
                this.filter.max_length = length || 1
            },
            setCheckedTables(checks: CheckedTables) {
                this.checked_tables = checks
            }
        }
    }
)