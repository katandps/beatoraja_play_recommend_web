<script setup lang="ts">
import { computed, watch } from "vue"
import SongDetail from "@/models/song_detail"
import {
    buildTableRows,
    failedIndex,
    filterSongs,
    hardIndex
} from "@/models/difficultyTableUser"

const props = defineProps<{
    tableSongs: SongDetail[]
    searchText: string
    lampFilter: string
    showAllRows: boolean
    rowsPerPage: number
    currentPage: number
}>()

const emit = defineEmits<{
    (e: "update:searchText", value: string): void
    (e: "update:lampFilter", value: string): void
    (e: "update:showAllRows", value: boolean): void
    (e: "update:currentPage", value: number): void
}>()

const toggleAllRows = () => {
    emit("update:showAllRows", !props.showAllRows)
}

const filteredSongs = computed(() =>
    filterSongs(props.tableSongs, props.searchText, props.lampFilter, hardIndex, failedIndex)
)
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
</script>

<template>
    <section class="panel-box">
        <div class="panel-header">
            <h3>曲一覧</h3>
            <div class="filters">
                <input class="form-control form-control-sm" type="text" placeholder="曲名検索" :value="searchText"
                    @input="emit('update:searchText', ($event.target as HTMLInputElement).value)" />
                <select class="form-control form-control-sm" :value="lampFilter"
                    @change="emit('update:lampFilter', ($event.target as HTMLSelectElement).value)">
                    <option value="all">ランプ全て</option>
                    <option value="hard">Hard以上</option>
                    <option value="uncleared">未達成</option>
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
                        <td
                            v-tooltip="{ content: row.titleWrapped, delay: { show: 100, hide: 0 }, popperClass: 'song-title-tooltip' }">
                            {{ row.title }}
                        </td>
                        <td>
                            <span class="lamp-pill" :class="`lamp-${row.lamp}`">{{ row.lamp }}</span>
                        </td>
                        <td>{{ row.rate }}</td>
                        <td>{{ row.miss }}</td>
                        <td>{{ row.last }}</td>
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

.lamp-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.lamp-Failed {
    background: #f4d2d2;
    color: #9c2f2f;
}

.lamp-NoPlay {
    background: #e5e5e5;
    color: #5a5a5a;
}

.lamp-AssistEasy {
    background: #c6c6ff;
    color: #2d2d6a;
}

.lamp-LightAssistEasy {
    background: #ffc6ff;
    color: #6a2d6a;
}

.lamp-Easy {
    background: #d7f7d6;
    color: #1e6a2a;
}

.lamp-Normal {
    background: #ffe8b7;
    color: #9a5b00;
}

.lamp-Hard {
    background: #ffd6d6;
    color: #b22828;
}

.lamp-ExHard {
    background: linear-gradient(135deg, #ffe3a1 0%, #fff3c9 45%, #ffd27a 100%);
    color: #8a4b00;
    box-shadow: 0 0 0 1px rgba(255, 215, 120, 0.7), 0 4px 10px rgba(255, 180, 60, 0.28);
    position: relative;
    overflow: hidden;
}

.lamp-ExHard::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 35%,
            transparent 65%);
    opacity: 0.7;
    pointer-events: none;
}

.lamp-FullCombo {
    background: linear-gradient(135deg, #9ff0f0 0%, #c9fbff 45%, #78dbe6 100%);
    color: #00545c;
    box-shadow: 0 0 0 1px rgba(120, 219, 230, 0.6), 0 4px 10px rgba(80, 180, 190, 0.25);
    position: relative;
    overflow: hidden;
}

.lamp-Perfect {
    background: linear-gradient(135deg, #d0d0ff 0%, #ece9ff 45%, #b0b0ff 100%);
    color: #2e2e6d;
    box-shadow: 0 0 0 1px rgba(176, 176, 255, 0.6), 0 4px 10px rgba(130, 130, 220, 0.25);
    position: relative;
    overflow: hidden;
}

.lamp-Max {
    background: linear-gradient(135deg, #f0f0ff 0%, #d8dcff 45%, #bfc6ff 100%);
    color: #2e2e7a;
    box-shadow: 0 0 0 1px rgba(191, 198, 255, 0.7), 0 4px 12px rgba(120, 130, 220, 0.3);
    position: relative;
    overflow: hidden;
}

.lamp-FullCombo::after,
.lamp-Perfect::after,
.lamp-Max::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 35%,
            transparent 65%);
    opacity: 0.7;
    pointer-events: none;
}

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
