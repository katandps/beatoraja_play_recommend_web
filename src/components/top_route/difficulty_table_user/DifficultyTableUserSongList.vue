<script setup lang="ts">
import { computed, watch } from "vue"
import SongDetail from "@/models/song_detail"
import {
    buildTableRows,
    filterSongs
} from "@/models/difficultyTableUser"
import ClearSymbol from "@/components/parts/clear_symbol.vue"

const props = defineProps<{
    tableSongs: SongDetail[]
    searchText: string
    levelFilter: string
    showAllRows: boolean
    rowsPerPage: number
    currentPage: number
}>()

const emit = defineEmits<{
    (e: "update:searchText", value: string): void
    (e: "update:levelFilter", value: string): void
    (e: "update:showAllRows", value: boolean): void
    (e: "update:currentPage", value: number): void
    (e: "showModal", value: SongDetail): void
}>()

const toggleAllRows = () => {
    emit("update:showAllRows", !props.showAllRows)
}

const filteredSongs = computed(() => filterSongs(props.tableSongs, props.searchText, props.levelFilter))
const levelOptions = computed(() => {
    const levels = Array.from(new Set(props.tableSongs.map((song) => song.level)))
    return levels.sort((a, b) => {
        const left = parseFloat(a.replace(/[^0-9.]/g, ""))
        const right = parseFloat(b.replace(/[^0-9.]/g, ""))
        if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
            return left - right
        }
        return a.localeCompare(b)
    })
})
const tableRows = computed(() => buildTableRows(filteredSongs.value))
const totalRows = computed(() => tableRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / props.rowsPerPage)))
const pagedRows = computed(() => {
    if (props.showAllRows) {
        return tableRows.value
    }
    const start = (props.currentPage - 1) * props.rowsPerPage
    return tableRows.value.slice(start, start + props.rowsPerPage)
})

watch([totalPages, () => props.showAllRows, () => props.currentPage], ([pages, showAll, current]) => {
    if (showAll) {
        return
    }
    if (current > pages) {
        emit("update:currentPage", pages)
    }
    if (current < 1) {
        emit("update:currentPage", 1)
    }
})

const goToPrev = () => {
    emit("update:currentPage", Math.max(1, props.currentPage - 1))
}

const goToNext = () => {
    emit("update:currentPage", Math.min(totalPages.value, props.currentPage + 1))
}

const showModal = (song: SongDetail) => emit("showModal", song)

const titleWrapped = (song: SongDetail) => song.title.replace(/([/\-→（）()[\]])/g, "$1\u200B")


</script>

<template>
    <section class="panel-box">
        <div class="panel-header">
            <h3>曲一覧</h3>
            <div class="filters">
                <input class="form-control form-control-sm" type="text" placeholder="曲名検索" :value="searchText"
                    @input="emit('update:searchText', ($event.target as HTMLInputElement).value)" />
                <select class="form-control form-control-sm" :value="levelFilter"
                    @change="emit('update:levelFilter', ($event.target as HTMLSelectElement).value)">
                    <option value="">レベル全て</option>
                    <option v-for="level in levelOptions" :key="level" :value="level">{{ level }}</option>
                </select>
                <button class="btn btn-sm btn-outline-secondary" @click="toggleAllRows">
                    {{ showAllRows ? '自動ページング' : 'すべて表示' }}
                </button>
            </div>
        </div>
        <div class="table-meta">
            <span>表示 {{ showAllRows ? totalRows : pagedRows.length }} / {{ totalRows }}</span>
            <div v-if="!showAllRows" class="pager">
                <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1" @click="goToPrev">
                    前へ
                </button>
                <span class="pager-text">{{ currentPage }} / {{ totalPages }}</span>
                <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages"
                    @click="goToNext">
                    次へ
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-sm align-middle">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Title</th>
                        <th>Lamp</th>
                        <th>Rate</th>
                        <th>Miss</th>
                        <th>Last</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in pagedRows" :key="row.title">
                        <td>{{ row.level }}</td>
                        <td @click="showModal(row)"
                            v-tooltip="{ content: titleWrapped(row), delay: { show: 100, hide: 0 }, popperClass: 'song-title-tooltip' }">
                            {{ row.title }}
                        </td>
                        <td>
                            <ClearSymbol :row="row" />

                        </td>
                        <td>{{ row.get("rate") }}%</td>
                        <td>{{ row.get("bp") }}</td>
                        <td>{{ row.get("date") }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!tableRows.length" class="empty-state">該当データがありません</div>
    </section>
</template>

<style scoped>
.panel-box {
    background: var(--panel);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid #f1eeea;
    animation: rise 720ms ease both;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.filters {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
}

.filters .btn {
    white-space: nowrap;
}

.filters .form-control {
    min-width: 140px;
}

.filters::-webkit-scrollbar {
    height: 6px;
}

.filters::-webkit-scrollbar-thumb {
    background: #d6d2cc;
    border-radius: 999px;
}

.empty-state {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f1f0f4;
    color: #6a6a78;
    font-size: 0.9rem;
}

.table-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
    font-size: 0.9rem;
    color: var(--muted);
}

.pager {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pager-text {
    font-weight: 600;
    color: #3a3a44;
}

/* .lamp-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
} */


.table {
    margin-top: 12px;
}

.table thead th {
    border-bottom: 2px solid #ede7e0;
    color: #3b3b42;
}

.table td:nth-child(2),
.table th:nth-child(2) {
    max-width: 360px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table tbody tr {
    transition: background 200ms ease;
}

.table tbody tr:hover {
    background: #fff3e9;
}

:deep(.song-title-tooltip) {
    max-width: 90vw;
}

:deep(.song-title-tooltip .v-popper__inner) {
    width: 360px !important;
    max-width: 360px !important;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-all;
    overflow-wrap: anywhere;
}

@media (max-width: 768px) {
    .panel-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
