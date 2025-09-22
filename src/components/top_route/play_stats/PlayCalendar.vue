<script setup lang="ts">
import { computed, ref } from 'vue'
import PlayStats from '../../../models/playStats'

interface Props {
    history: PlayStats
}
const props = defineProps<Props>()

const currentDate = ref(new Date())

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
const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1))

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

// 月を変更
const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + delta)
    currentDate.value = newDate
}

// 今月に戻る
const goToCurrentMonth = () => {
    currentDate.value = new Date()
}
</script>

<template>
    <div class="calendar-container">
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
                        'has-play': day.playData && day.playData.daily.play_count > 0
                    }" :style="{ backgroundColor: getIntensityColor(day.playData) }" :title="getTooltipText(day)">
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
    </div>
</template>

<style scoped>
.calendar-container {
    max-width: 800px;
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
</style>