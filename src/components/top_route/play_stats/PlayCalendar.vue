<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PlayStats from '../../../models/playStats'
import Api from '@/api';
import { useLoginStore } from "@/store/session"
import SongModal, { ISongModal } from "@/components/top_route/score_viewer/modal/SongModal.vue"
import Columns from '@/models/columns';
import SongDetail, { Log } from '@/models/song_detail';
import Tables from '@/models/difficultyTable';
import RowSong from "../score_viewer/cell/RowSong.vue"
import RowHeader from "../score_viewer/cell/RowHeader.vue"
import RowColGroup from "../score_viewer/cell/RowColGroup.vue"
import { useFilterStore } from '@/store/filter';
import html2canvas from 'html2canvas'

const sessionStore = useLoginStore()
const filterStore = useFilterStore()

const columns = computed(() => {
    const columns = new Columns({})
    columns.for_recent()
    columns.columns.play = false
    return columns
})
const song_modal = ref<ISongModal>()
const level_list = computed(() => tables.value.level_list())
const exists_tables = computed(() => !!tables.value)
const exists_scores = computed(() => !!scores.value)
const exists_songs = computed(() => !!songs.value)
const is_initialized = computed(
    () => exists_tables.value && exists_songs.value && exists_scores.value
)
const filtered_score = computed(() => {
    if (!is_initialized.value) {
        return []
    }
    let ret = []
    let used: { [key: string]: boolean } = {}
    for (let table_index = 0; table_index < tables.value.tables.length; table_index += 1) {
        const table = tables.value.tables[table_index]
        for (const level in table.levels) {
            // all difficulties are viewable 
            const hashes = table.levels[level]
            if (!hashes) {
                continue
            }

            for (const hash of hashes) {
                if (used[hash]) {
                    continue
                }
                used[hash] = true
                if (!scores.value?.score_exists(hash)) {
                    continue
                }
                let score = new SongDetail()
                score.set_level(level)
                score.init_score(scores.value.get_score(hash))
                score.init_song(songs.value.get_score(hash), hash)

                ret.push(score)
            }
        }
    }
    return ret
})

interface Props {
    history: PlayStats
}
const props = defineProps<Props>()
const scores = ref()
const currentDate = ref(new Date())
const selectedDay = ref<any>(null) // 選択された日のデータ

onMounted(() => {
    Api.fetch_tables(sessionStore.accessToken).then((t) => (tables.value = t))
    Api.fetch_songs(sessionStore.accessToken).then((s) => (songs.value = s))
})
const tables = ref(new Tables([]))
const songs = ref()

const sorted_song_list = computed(() => {
    let songs = filtered_score.value
    return songs
        .sort((a, b) =>
            SongDetail.cmp(
                a,
                b,
                filterStore.filter.sort_key,
                filterStore.filter.sort_desc,
                level_list.value
            )
        )
        .slice(0, filterStore.filter.max_length || songs.length)
})

// 現在表示している年月
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 月の名前
const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
]

// 累計データと日別差分を計算
const statsData = computed(() => {
    const logs = [...props.history.logs].sort((a, b) => a.date.localeCompare(b.date))
    const dataMap = new Map()

    for (let i = 0; i < logs.length; i++) {
        const current = logs[i]
        const previous = i > 0 ? logs[i - 1] : null

        // 日別の差分を計算
        const dailyData = {
            date: current.date,
            // 日別データ
            daily: {
                play_count: previous ? current.play_count - previous.play_count : current.play_count,
                clear_count: previous ? current.clear_count - previous.clear_count : current.clear_count,
                notes_count: previous ? current.notes() - previous.notes() : current.notes(),
                play_time: previous ? current.play_time - previous.play_time : current.play_time
            },
            // 累計データ
            total: {
                play_count: current.play_count,
                clear_count: current.clear_count,
                notes_count: current.notes(),
                play_time: current.play_time
            }
        }

        dataMap.set(current.date, dailyData)
    }

    return dataMap
})

// その月の1日と最終日を取得
const firstDayOfMonth = computed(() => Date.UTC(currentYear.value, currentMonth.value, 1,))

// 月の最初の週の開始日（日曜日）
const startDate = computed(() => {
    const firstDay = new Date(firstDayOfMonth.value)
    const dayOfWeek = firstDay.getDay()
    firstDay.setDate(firstDay.getDate() - dayOfWeek)
    return firstDay
})

// カレンダーの日付配列を生成（6週間分）
const calendarDays = computed(() => {
    const days = []
    const current = new Date(startDate.value)

    for (let week = 0; week < 6; week++) {
        const weekDays = []
        for (let day = 0; day < 7; day++) {
            const dateStr = current.toISOString().split('T')[0]
            const playData = statsData.value.get(dateStr)

            weekDays.push({
                date: new Date(current),
                dateString: dateStr,
                isCurrentMonth: current.getMonth() === currentMonth.value,
                playData: playData || null
            })

            current.setDate(current.getDate() + 1)
        }
        days.push(weekDays)
    }

    return days
})

// プレイ強度に基づく色の取得（日別データ用）
const getIntensityColor = (playData: any) => {
    if (!playData) return '#f0f0f0'

    const playCount = playData.daily.play_count
    if (playCount === 0) return '#ebedf0'
    if (playCount < 20) return '#c6e48b'
    if (playCount < 40) return '#7bc96f'
    if (playCount < 60) return '#239a3b'
    return '#198127'
}

// 時間をフォーマット（秒を時間:分に変換）
const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
        return `${hours}時間${minutes}分`
    }
    return `${minutes}分`
}

// ツールチップのテキストを生成
const getTooltipText = (day: any) => {
    if (!day.playData) {
        return `${day.dateString}\nプレイなし`
    }

    const daily = day.playData.daily
    const total = day.playData.total

    return `${day.dateString}
【当日】
プレイ数: ${daily.play_count}
クリア数: ${daily.clear_count}
ノーツ数: ${daily.notes_count.toLocaleString()}
プレイ時間: ${formatTime(daily.play_time)}

【累計】
プレイ数: ${total.play_count.toLocaleString()}
クリア数: ${total.clear_count.toLocaleString()}
ノーツ数: ${total.notes_count.toLocaleString()}
プレイ時間: ${formatTime(total.play_time)}`
}

// 日付をクリックしたときの処理
const selectDay = (day: any) => {
    selectedDay.value = day
    // minus 1 day
    const oneDayAfter: Date = new Date(selectedDay.value.date)
    oneDayAfter.setTime(oneDayAfter.getTime() + 86400000);
    const since = new Date(selectedDay.value.date)
    const until = new Date(oneDayAfter)
    const timeZoneOffset = since.getTimezoneOffset()
    since.setMinutes(since.getMinutes() + timeZoneOffset)
    until.setMinutes(until.getMinutes() + timeZoneOffset)

    if (sessionStore.userInfo) {
        Api.fetch_score(since, until, sessionStore.userInfo.user_id, sessionStore.accessToken).then((s) => (scores.value = s))
    }
}

// 選択された日の詳細表示用の日付フォーマット
const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
}

// 月を変更
const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + delta)
    currentDate.value = newDate
    selectedDay.value = null // 月が変わったら選択をリセット
}

// 今月に戻る
const goToCurrentMonth = () => {
    currentDate.value = new Date()
    selectedDay.value = null
}

// --- method ---
const show_song_modal = async (song: SongDetail) => {
    let score = await Api.fetch_my_score(song.sha256, sessionStore.accessToken)
    song_modal.value?.showModal(song, selectedDay.value, score.log as Log[])
}

// 画像ダウンロード機能
const downloadAsImage = async () => {
    const element = document.getElementById('stats-download-area')
    if (!element) return

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // 高解像度
            useCORS: true,
            logging: false
        })

        const link = document.createElement('a')
        link.download = `beatoraja-stats-${selectedDay.value?.dateString || 'unknown'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    } catch (error) {
        console.error('画像のダウンロードに失敗しました:', error)
        alert('画像のダウンロードに失敗しました')
    }
}

</script>

<template>
    <div class="calendar-container">
        <!-- カレンダー部分は変更なし -->
        <div class="calendar-header">
            <button @click="changeMonth(-1)" class="nav-button">‹</button>
            <h3 class="month-title">{{ currentYear }}年 {{ monthNames[currentMonth] }}</h3>
            <button @click="changeMonth(1)" class="nav-button">›</button>
        </div>

        <button @click="goToCurrentMonth" class="today-button">今月</button>

        <div class="calendar-grid">
            <!-- 曜日ヘッダー -->
            <div class="weekdays">
                <div class="weekday">日</div>
                <div class="weekday">月</div>
                <div class="weekday">火</div>
                <div class="weekday">水</div>
                <div class="weekday">木</div>
                <div class="weekday">金</div>
                <div class="weekday">土</div>
            </div>

            <!-- カレンダー本体 -->
            <div class="calendar-body">
                <div v-for="(week, weekIndex) in calendarDays" :key="weekIndex" class="week">
                    <div v-for="(day, dayIndex) in week" :key="dayIndex" class="day" :class="{
                        'other-month': !day.isCurrentMonth,
                        'has-play': day.playData && day.playData.daily.play_count > 0,
                        'selected': selectedDay && selectedDay.dateString === day.dateString
                    }" :style="{ backgroundColor: getIntensityColor(day.playData) }" :title="getTooltipText(day)"
                        @click="selectDay(day)">
                        <span class="day-number">{{ day.date.getDate() }}</span>
                        <div v-if="day.playData && day.playData.daily.play_count > 0" class="play-indicator">
                            {{ day.playData.daily.play_count }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 凡例 -->
        <div class="legend">
            <span class="legend-label">日別プレイ数:</span>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #ebedf0;"></div>
                    <span>0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #c6e48b;"></div>
                    <span>1-19</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #7bc96f;"></div>
                    <span>20-39</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #239a3b;"></div>
                    <span>40-59</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #198127;"></div>
                    <span>60+</span>
                </div>
            </div>
        </div>

        <!-- 選択された日の詳細表示 -->
        <div v-if="selectedDay" class="selected-day-details">
            <div class="details-header">
                <h4>{{ formatSelectedDate(selectedDay.dateString) }}</h4>
                <div class="header-buttons">
                    <button @click="downloadAsImage" class="download-button" title="画像としてダウンロード">
                        📷 ダウンロード
                    </button>
                    <button @click="selectedDay = null" class="close-button">×</button>
                </div>
            </div>

            <!-- ダウンロード対象エリア（統計情報とスコア表を含める） -->
            <div id="stats-download-area" class="download-area">
                <div class="download-header">
                    <h3>{{ formatSelectedDate(selectedDay.dateString) }} - プレイ統計</h3>
                </div>

                <div v-if="selectedDay.playData">
                    <!-- 統計情報 -->
                    <div class="details-content">
                        <div class="stats-section">
                            <h5>当日の実績</h5>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">プレイ数</span>
                                    <span class="stat-value">{{ selectedDay.playData.daily.play_count }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">クリア数</span>
                                    <span class="stat-value">{{ selectedDay.playData.daily.clear_count }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">ノーツ数</span>
                                    <span class="stat-value">{{ selectedDay.playData.daily.notes_count.toLocaleString()
                                    }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">プレイ時間</span>
                                    <span class="stat-value">{{ formatTime(selectedDay.playData.daily.play_time)
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="stats-section">
                            <h5>累計実績</h5>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">プレイ数</span>
                                    <span class="stat-value">{{ selectedDay.playData.total.play_count.toLocaleString()
                                    }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">クリア数</span>
                                    <span class="stat-value">{{ selectedDay.playData.total.clear_count.toLocaleString()
                                    }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">ノーツ数</span>
                                    <span class="stat-value">{{ selectedDay.playData.total.notes_count.toLocaleString()
                                    }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">プレイ時間</span>
                                    <span class="stat-value">{{ formatTime(selectedDay.playData.total.play_time)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-else class="no-play-message">
                    <p>この日はプレイしていません</p>
                </div>

                <div class="table-wrapper" v-if="selectedDay && scores && selectedDay.playData">
                    <div class="score-table detail">
                        <RowColGroup :columns="columns" />
                        <RowHeader :columns="columns" />
                        <div class="tbody">
                            <RowSong v-for="song in sorted_song_list" :key="song.md5" :song="song" :columns="columns"
                                :percentile="false" @showModal="show_song_modal" />
                        </div>
                    </div>
                </div>
            </div>
            <song-modal ref="song_modal" />
        </div>
    </div>
</template>

<style scoped>
.calendar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.nav-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.nav-button:hover {
    background: #0056b3;
}

.month-title {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
}

.today-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 15px;
}

.today-button:hover {
    background: #1e7e34;
}

.calendar-grid {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #f8f9fa;
}

.weekday {
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-right: 1px solid #ddd;
}

.weekday:last-child {
    border-right: none;
}

.calendar-body {
    display: grid;
    grid-template-rows: repeat(6, 1fr);
}

.week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day {
    min-height: 80px;
    border: 1px solid #ddd;
    padding: 4px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
}

.day:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.day.selected {
    border: 3px solid #007bff;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.day.other-month {
    opacity: 0.3;
}

.day-number {
    font-size: 12px;
    font-weight: bold;
}

.play-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 10px;
    font-weight: bold;
    color: #333;
}

.selected-day-details {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f8f9fa;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.details-header h4 {
    margin: 0;
    color: #333;
}

.close-button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.close-button:hover {
    background: #c82333;
}

.details-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.stats-section h5 {
    margin: 0 0 15px 0;
    color: #495057;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
}

.stats-grid {
    display: grid;
    gap: 10px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    border-left: 4px solid #007bff;
}

.stat-label {
    font-weight: 500;
    color: #6c757d;
}

.stat-value {
    font-weight: bold;
    color: #495057;
}

.no-play-message {
    text-align: center;
    color: #6c757d;
    font-style: italic;
}

.legend {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 14px;
}

.legend-items {
    display: flex;
    gap: 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.legend-color {
    width: 12px;
    height: 12px;
    border: 1px solid #ddd;
    border-radius: 2px;
}

.legend-label {
    font-weight: bold;
}

.header-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
}

.download-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.download-button:hover {
    background: #218838;
}

.download-area {
    background: white;
    padding: 30px;
    border-radius: 8px;
    margin: 10px 0;
}

.download-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 3px solid #007bff;
    padding-bottom: 15px;
}

.download-header h3 {
    margin: 0;
    color: #333;
    font-size: 24px;
}

.download-scores {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #e9ecef;
}

.download-scores h5 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 18px;
}

.simple-score-list {
    display: grid;
    gap: 8px;
}

.simple-score-item {
    display: grid;
    grid-template-columns: 30px 1fr auto auto;
    gap: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    align-items: center;
}

.score-rank {
    font-weight: bold;
    color: #6c757d;
    text-align: right;
}

.score-title {
    font-weight: 500;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.score-clear {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    background: #e9ecef;
    color: #495057;
}

.score-value {
    font-weight: bold;
    color: #007bff;
    text-align: right;
    min-width: 80px;
}

.download-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    text-align: center;
}

.download-footer p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.table-wrapper {
    margin-top: 30px;
}

.table-wrapper h5 {
    margin-bottom: 15px;
    color: #495057;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
}

/* ダウンロード範囲内のテーブル用スタイル */
.download-table-wrapper {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #e9ecef;
}

.download-table-wrapper h5 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 18px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
}

.download-score-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.download-score-table th,
.download-score-table td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
}

.download-score-table th {
    background: #f8f9fa;
    font-weight: bold;
    color: #495057;
    border-bottom: 2px solid #007bff;
    font-size: 14px;
}

.download-score-table td {
    font-size: 12px;
    color: #333;
}

.download-score-table tr:nth-child(even) {
    background: #f8f9fa;
}

.download-score-table tr:hover {
    background: #e9ecef;
}

.song-title {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.song-level {
    text-align: center;
    font-weight: bold;
    color: #007bff;
}

.song-score,
.song-combo {
    text-align: right;
    font-weight: bold;
    color: #28a745;
}

.song-rank {
    text-align: center;
    font-weight: bold;
}

.song-clear {
    text-align: center;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    background: #e9ecef;
    color: #495057;
}

.song-bp {
    text-align: center;
    color: #dc3545;
    font-weight: bold;
}

/* レスポンシブ対応（ダウンロード時は無効化） */
@media screen and (max-width: 768px) {
    .details-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .header-buttons {
        flex-direction: column;
        gap: 5px;
    }
}

/* 印刷・ダウンロード用スタイル */
@media print {
    .download-area {
        box-shadow: none;
        border: none;
        page-break-inside: avoid;
    }

    .download-score-table {
        page-break-inside: auto;
    }

    .download-score-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }
}

/* ダウンロード画像用の調整 */
.download-area .download-score-table {
    font-size: 11px;
}

.download-area .download-score-table th,
.download-area .download-score-table td {
    padding: 6px 8px;
}

/* ダウンロード用のテーブル高さ調整 */
.download-area .table-wrapper {
    height: auto !important;
    /* 固定高さを無効化 */
    max-height: none !important;
    min-height: auto !important;
    overflow: visible !important;
    /* スクロールを無効化 */
}

.download-area .score-table {
    height: auto !important;
    max-height: none !important;
}

/* ダウンロード範囲全体の高さも自動調整 */
.download-area {
    background: white;
    padding: 30px;
    border-radius: 8px;
    margin: 10px 0;
    height: auto;
    /* 追加 */
    min-height: auto;
    /* 追加 */
}

/* テーブル行数が少ない場合の調整 */
.download-area .tbody {
    display: table-row-group;
    height: auto !important;
}

/* 不要な余白を削除 */
.download-area .table-wrapper:after {
    content: none;
}

/* html2canvas用の最適化 */
@media screen {
    .download-area .table-wrapper {
        /* 通常表示時は元のスタイルを維持 */
        height: 80vh;
        overflow: auto;
    }
}

/* html2canvas実行時の特別な調整 */
.html2canvas-rendering .table-wrapper {
    height: auto !important;
    overflow: visible !important;
    max-height: none !important;
}
</style>