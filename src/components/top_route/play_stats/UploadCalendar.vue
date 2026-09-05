<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Api from '@/api'
import { useLoginStore } from '@/store/session'
import { useFilterStore } from '@/store/filter'
import UploadStats, { UploadStat } from '@/models/uploadStats'
import Columns from '@/models/columns'
import Tables from '@/models/difficultyTable'
import Songs from '@/models/songs'
import SongDetail, { Log } from '@/models/song_detail'
import SongModal, { ISongModal } from '@/components/top_route/score_viewer/modal/SongModal.vue'
import RowSong from '../score_viewer/cell/RowSong.vue'
import RowHeader from '../score_viewer/cell/RowHeader.vue'
import RowColGroup from '../score_viewer/cell/RowColGroup.vue'

interface Props {
    uploads: UploadStats
}

const props = defineProps<Props>()
const sessionStore = useLoginStore()
const filterStore = useFilterStore()
const currentDate = ref(new Date())
const selectedDate = ref<string | null>(null)
const selectedUpload = ref<UploadStat | null>(null)
const scores = ref()
const tables = ref(new Tables([]))
const songs = ref<Songs>()
const songModal = ref<ISongModal>()

onMounted(() => {
    Api.fetch_tables(sessionStore.accessToken).then((result) => (tables.value = result))
    Api.fetch_songs(sessionStore.accessToken).then((result) => (songs.value = result))
})

const columns = computed(() => {
    const result = new Columns({})
    result.for_recent()
    result.columns.play = false
    return result
})
const levelList = computed(() => tables.value.level_list())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const uploadsByDate = computed(() => {
    const result = new Map<string, UploadStat[]>()
    props.uploads.uploads.forEach((upload) => {
        const uploads = result.get(upload.upload_at) || []
        uploads.push(upload)
        result.set(upload.upload_at, uploads)
    })
    return result
})
const calendarDays = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const current = new Date(currentYear.value, currentMonth.value, 1 - firstDay.getDay())
    const weeks = []

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const week = []
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dateString = [current.getFullYear(), String(current.getMonth() + 1).padStart(2, '0'), String(current.getDate()).padStart(2, '0')].join('-')
            week.push({
                date: new Date(current),
                dateString,
                isCurrentMonth: current.getMonth() === currentMonth.value,
                uploads: uploadsByDate.value.get(dateString) || []
            })
            current.setDate(current.getDate() + 1)
        }
        weeks.push(week)
    }
    return weeks
})
const filteredScores = computed(() => {
    if (!songs.value || !scores.value) return []
    return songs.value.generate_song_detail_list(tables.value, scores.value)
})
const sortedSongList = computed(() => filteredScores.value
    .slice()
    .sort((left, right) => SongDetail.cmp(left, right, filterStore.filter.sort_key, filterStore.filter.sort_desc, levelList.value))
    .slice(0, filterStore.filter.max_length || filteredScores.value.length))
const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`
}

const selectDay = (dateString: string, uploads: UploadStat[]) => {
    selectedDate.value = dateString
    selectedUpload.value = uploads[0] || null
    scores.value = undefined
    if (selectedUpload.value) selectUpload(selectedUpload.value)
}
const selectUpload = async (upload: UploadStat) => {
    selectedUpload.value = upload
    scores.value = await Api.fetch_upload_score(upload.upload_id, sessionStore.accessToken)
}
const changeMonth = (delta: number) => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + delta, 1)
    selectedDate.value = null
    selectedUpload.value = null
    scores.value = undefined
}
const goToCurrentMonth = () => {
    currentDate.value = new Date()
    selectedDate.value = null
    selectedUpload.value = null
    scores.value = undefined
}
const showSongModal = async (song: SongDetail) => {
    const score = await Api.fetch_my_score(song.sha256, sessionStore.accessToken)
    songModal.value?.showModal(song, selectedDate.value || '', score.log as Log[])
}
</script>

<template>
    <section class="upload-calendar">
        <div class="calendar-header">
            <button class="nav-button" aria-label="前月" @click="changeMonth(-1)">‹</button>
            <h3 class="month-title">{{ currentYear }}年 {{ monthNames[currentMonth] }}</h3>
            <button class="nav-button" aria-label="翌月" @click="changeMonth(1)">›</button>
        </div>
        <button class="today-button" @click="goToCurrentMonth">今月</button>

        <div class="calendar-grid">
            <div class="weekdays">
                <div v-for="weekday in ['日', '月', '火', '水', '木', '金', '土']" :key="weekday" class="weekday">{{ weekday }}</div>
            </div>
            <div class="calendar-body">
                <div v-for="(week, weekIndex) in calendarDays" :key="weekIndex" class="week">
                    <div v-for="day in week" :key="day.dateString" class="day" :class="{ 'other-month': !day.isCurrentMonth, selected: selectedDate === day.dateString, 'has-upload': day.uploads.length, 'has-not-upload': !day.uploads.length }" @click="selectDay(day.dateString, day.uploads)">
                        <span class="day-number">{{ day.date.getDate() }}</span>
                        <strong v-if="day.uploads.length" class="play-indicator">{{ day.uploads.length }}件</strong>
                    </div>
                </div>
            </div>
        </div>
        <div class="legend">
            <span class="legend-label">アップロード数:</span>
            <div class="legend-items">
                <div class="legend-item"><span class="legend-color"></span><span>あり</span></div>
            </div>
        </div>

        <div v-if="selectedDate" class="selected-day-details">
            <div class="details-header">
                <h4>{{ selectedDate }} のアップロード</h4>
                <button class="close-button" aria-label="詳細を閉じる" @click="selectedDate = null">×</button>
            </div>
            <p v-if="!uploadsByDate.get(selectedDate)?.length" class="empty-message">この日のアップロードはありません</p>
            <div v-else class="upload-selector">
                <button v-for="upload in uploadsByDate.get(selectedDate)" :key="upload.upload_id" :class="{ active: selectedUpload?.upload_id === upload.upload_id }" @click="selectUpload(upload)">ID: {{ upload.upload_id }}</button>
            </div>
            <div v-if="selectedUpload" class="details-content">
                <div class="stats-section">
                    <h5>今回の実績</h5>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">プレイ数</span>
                            <span class="stat-value">{{ selectedUpload.stats.play_count.toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">クリア数</span>
                            <span class="stat-value">{{ selectedUpload.stats.clear_count.toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">ノーツ数</span>
                            <span class="stat-value">{{ selectedUpload.stats.notes().toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">プレイ時間</span>
                            <span class="stat-value">{{ formatTime(selectedUpload.stats.play_time) }}</span>
                        </div>
                    </div>
                </div>
                <div class="stats-section">
                    <h5>累計実績</h5>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">プレイ数</span>
                            <span class="stat-value">{{ selectedUpload.total_stats.play_count.toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">クリア数</span>
                            <span class="stat-value">{{ selectedUpload.total_stats.clear_count.toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">ノーツ数</span>
                            <span class="stat-value">{{ selectedUpload.total_stats.notes().toLocaleString() }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">プレイ時間</span>
                            <span class="stat-value">{{ formatTime(selectedUpload.total_stats.play_time) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="selectedUpload && scores" class="table-wrapper">
                <div class="score-table detail">
                    <RowColGroup :columns="columns" />
                    <RowHeader :columns="columns" />
                    <div class="tbody">
                        <RowSong v-for="song in sortedSongList" :key="song.md5" :song="song" :columns="columns" :percentile="false" @showModal="showSongModal" />
                    </div>
                </div>
            </div>
        </div>
        <SongModal ref="songModal" />
    </section>
</template>

<style scoped>
.upload-calendar { max-width: 1200px; margin: 0 auto; padding: 20px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.nav-button { background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 16px; }
.nav-button:hover { background: #0056b3; }
.month-title { margin: 0; font-size: 24px; font-weight: bold; }
.today-button { background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 15px; }
.today-button:hover { background: #1e7e34; }
.calendar-grid { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.weekdays, .week { display: grid; grid-template-columns: repeat(7, 1fr); }
.weekdays { background: #f8f9fa; }
.weekday { padding: 10px; text-align: center; font-weight: bold; border-right: 1px solid #ddd; }
.weekday:last-child { border-right: none; }
.calendar-body { display: grid; grid-template-rows: repeat(6, 1fr); }
.day { min-height: 80px; border: 1px solid #ddd; padding: 4px; position: relative; cursor: pointer; transition: all .2s; background: #fff; color: #333; }
.day.has-upload { background: #8bcbe4; }
.day.has-not-upload { background: #f0f0f0; }
.day:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0, 0, 0, .2); z-index: 1; }
.day.selected { border: 3px solid #007bff; box-shadow: 0 0 10px rgba(0, 123, 255, .5); }
.day.other-month { opacity: .3; }
.day-number { font-size: 12px; font-weight: bold; }
.play-indicator { position: absolute; bottom: 2px; right: 2px; font-size: 10px; font-weight: bold; color: #333; }
.legend { margin-top: 20px; display: flex; align-items: center; gap: 15px; font-size: 14px; }
.legend-items, .legend-item { display: flex; align-items: center; gap: 4px; }
.legend-color { width: 12px; height: 12px; border: 1px solid #ddd; border-radius: 2px; background: #8bcbe4; }
.legend-label { font-weight: bold; }
.selected-day-details { margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; }
.details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
.details-header h4 { margin: 0; color: #333; }
.close-button { background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 16px; }
.close-button:hover { background: #c82333; }
.upload-selector { display: flex; flex-wrap: wrap; gap: 10px; }
.upload-selector button { background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
.upload-selector button.active { background: #007bff; }
.details-content { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; }
.stats-section { min-width: 0; }
.stats-section h5 { margin: 0 0 15px; color: #495057; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
.stats-grid { display: grid; gap: 10px; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 12px; border-left: 4px solid #007bff; border-radius: 4px; background: white; }
.stat-label { color: #6c757d; font-weight: 500; }
.stat-value { color: #495057; font-weight: bold; }
.table-wrapper { margin-top: 30px; }
.empty-message { text-align: center; color: #6c757d; font-style: italic; }
@media screen and (max-width: 768px) { .day { min-height: 56px; } .details-content { grid-template-columns: 1fr; gap: 20px; } }
</style>