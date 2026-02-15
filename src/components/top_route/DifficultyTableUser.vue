<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import Api from "@/api"
import Tables from "@/models/difficultyTable"
import Songs from "@/models/songs"
import Scores from "@/models/scores"
import SongDetail from "@/models/song_detail"
import { DateFormatter } from "@/models/date_formatter"
import { useLoginStore } from "@/store/session"
import config from "@/const"

const store = useLoginStore()
const route = useRoute()
const router = useRouter()

const tables = ref<Tables>(Tables.default())
const songs = ref<Songs | null>(null)
const scores = ref<Scores | null>(null)
const selectedTableId = ref<number>(0)
const searchText = ref("")
const lampFilter = ref("all")
const isLoading = ref(false)
const message = ref("")
const currentPage = ref(1)
const rowsPerPage = ref(50)
const showAllRows = ref(false)
const maxAutoRows = 100

const viewDate = ref((() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(0, 0, 0, 0)
  return d
})())

const userId = computed(() => {
  const q = parseInt(route.query.user_id as string)
  if (q) {
    return q
  }
  return store.userInfo?.user_id || 0
})

const canLoad = computed(() => !!store.accessToken && userId.value > 0)
const tableList = computed(() => tables.value.name_list())
const selectedTable = computed(() =>
  tables.value.tables.find((t) => t.id === selectedTableId.value) || tables.value.first()
)
const selectedTableName = computed(() => selectedTable.value?.name || "未選択")
const userName = computed(() => scores.value?.name || "")

const hardIndex = config.LAMP_INDEX.indexOf("Hard")
const failedIndex = config.LAMP_INDEX.indexOf("Failed")
const lampIndexDisplay = computed(() => [...config.LAMP_INDEX].reverse())
const lampIndexMap = computed(() => {
  const map: { [key: string]: number } = {}
  config.LAMP_INDEX.forEach((lamp, index) => {
    map[lamp] = index
  })
  return map
})

const isValidDate = (d: Date) => d && d.getFullYear() > 2000

const tableSongs = computed(() => {
  if (!scores.value || !songs.value || !selectedTable.value) {
    return [] as SongDetail[]
  }
  const used: { [key: string]: boolean } = {}
  const list: SongDetail[] = []
  const levels = selectedTable.value.levels
  for (const level in levels) {
    const hashes = levels[level]
    if (!hashes) {
      continue
    }
    for (const hash of hashes) {
      if (used[hash]) {
        continue
      }
      used[hash] = true
      const detail = new SongDetail()
      detail.set_level(level)
      detail.init_score(scores.value.get_score(hash))
      detail.init_song(songs.value.get_score(hash), hash)
      list.push(detail)
    }
  }
  return list.sort(SongDetail.cmp_title)
})

const filteredSongs = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  return tableSongs.value.filter((song) => {
    if (keyword && !song.title.toLowerCase().includes(keyword)) {
      return false
    }
    if (lampFilter.value === "hard") {
      return song.clear_type >= hardIndex
    }
    if (lampFilter.value === "uncleared") {
      return song.clear_type <= failedIndex
    }
    return true
  })
})

const updateSince = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  d.setHours(0, 0, 0, 0)
  return d
})

const summaryCards = computed(() => {
  const total = tableSongs.value.length
  const cleared = tableSongs.value.filter((s) => s.clear_type !== 0).length
  const rate = total === 0 ? 0 : Math.round((cleared / total) * 100)
  const scored = tableSongs.value.filter((s) => s.clear_type !== 0)
  const scoreAvg =
    scored.length === 0
      ? "-"
      : Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length).toLocaleString()
  const updateCount = tableSongs.value.filter(
    (s) => s.score > s.score_before && s.score_updated_at >= updateSince.value
  ).length
  return [
    { label: "総譜面数", value: total.toLocaleString() },
    { label: "ランプ達成率", value: `${rate}%` },
    { label: "平均スコア", value: scoreAvg },
    { label: "ベスト更新", value: updateCount.toLocaleString() }
  ]
})

const topUpdates = computed(() => {
  return tableSongs.value
    .filter((s) => s.score > s.score_before)
    .filter((s) => s.score_updated_at >= updateSince.value)
    .sort((a, b) => (b.score - b.score_before) - (a.score - a.score_before))
    .slice(0, 5)
    .map((s) => ({
      title: s.title,
      level: s.level,
      diff: `+${(s.score - s.score_before).toLocaleString()}`
    }))
})

const tableRows = computed(() => {
  return filteredSongs.value.map((s) => ({
    level: s.level,
    title: s.title,
    lamp: config.LAMP_INDEX[s.clear_type],
    score: s.score ? s.score.toLocaleString() : "0",
    last: isValidDate(s.updated_at) ? DateFormatter.format(s.updated_at) : "-"
  }))
})

const totalRows = computed(() => tableRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / rowsPerPage.value)))
const pagedRows = computed(() => {
  if (showAllRows.value) {
    return tableRows.value
  }
  const start = (currentPage.value - 1) * rowsPerPage.value
  return tableRows.value.slice(start, start + rowsPerPage.value)
})

const updateRowsPerPage = () => {
  const base = 420
  const rowHeight = 36
  const height = Math.max(window.innerHeight - base, 200)
  const autoRows = Math.max(20, Math.min(maxAutoRows, Math.floor(height / rowHeight)))
  rowsPerPage.value = autoRows
  currentPage.value = Math.min(currentPage.value, totalPages.value)
}

const goToPrev = () => {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

const goToNext = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

const lampCountsByLevel = computed(() => {
  const baseLevels = selectedTable.value?.level_list || []
  const map = new Map<string, number[]>()
  baseLevels.forEach((level) => map.set(level, config.LAMP_INDEX.map(() => 0)))
  tableSongs.value.forEach((s) => {
    if (!map.has(s.level)) {
      map.set(s.level, config.LAMP_INDEX.map(() => 0))
    }
    const counts = map.get(s.level)
    if (!counts || counts[s.clear_type] === undefined) {
      return
    }
    counts[s.clear_type] += 1
  })
  return Array.from(map.entries()).map(([level, counts]) => ({
    level,
    counts,
    total: Math.max(counts.reduce((sum, v) => sum + v, 0), 1)
  }))
})

const scoreRateStatsByLevel = computed(() => {
  const baseLevels = selectedTable.value?.level_list || []
  const map = new Map<string, number[]>()
  baseLevels.forEach((level) => map.set(level, []))
  tableSongs.value.forEach((s) => {
    if (s.clear_type === 0 || s.total_notes === 0) {
      return
    }
    if (!map.has(s.level)) {
      map.set(s.level, [])
    }
    map.get(s.level)?.push(s.score_rate())
  })
  const percentile = (values: number[], p: number) => {
    if (values.length === 0) {
      return 0
    }
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.floor((sorted.length - 1) * p)
    return sorted[index]
  }
  return Array.from(map.entries()).map(([level, values]) => {
    const avg = values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length
    return {
      level,
      count: values.length,
      avg,
      median: percentile(values, 0.5),
      p90: percentile(values, 0.9),
      p10: percentile(values, 0.1)
    }
  })
})

const timeline = computed(() => {
  const map = new Map<string, number>()
  tableSongs.value.forEach((s) => {
    if (!isValidDate(s.updated_at)) {
      return
    }
    const key = DateFormatter.format(s.updated_at)
    map.set(key, (map.get(key) || 0) + 1)
  })
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? -1 : 1))
    .slice(0, 5)
    .map(([date, count]) => ({ date: date.slice(5), text: `${count}曲更新` }))
})

const calendarDays = computed(() => {
  const map = new Map<string, number>()
  tableSongs.value.forEach((s) => {
    if (!isValidDate(s.updated_at)) {
      return
    }
    const key = DateFormatter.format(s.updated_at)
    map.set(key, (map.get(key) || 0) + 1)
  })
  const days: { date: string, count: number }[] = []
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const key = DateFormatter.format(d)
    days.push({ date: key, count: map.get(key) || 0 })
  }
  return days
})

const lastUpdated = computed(() => {
  const dates = tableSongs.value
    .map((s) => s.updated_at)
    .filter((d) => isValidDate(d))
    .sort((a, b) => b.getTime() - a.getTime())
  return dates.length === 0 ? "-" : DateFormatter.format(dates[0])
})

const loadTablesAndSongs = async () => {
  if (!store.accessToken) {
    message.value = "ログインしてください"
    return
  }
  isLoading.value = true
  tables.value = await Api.fetch_tables(store.accessToken)
  songs.value = await Api.fetch_songs(store.accessToken)
  const queryTableId = parseInt(route.query.table_id as string)
  const fallbackTable = tables.value.first()
  if (queryTableId && tables.value.tables.some((t) => t.id === queryTableId)) {
    selectedTableId.value = queryTableId
  } else if (fallbackTable) {
    selectedTableId.value = fallbackTable.id
  }
  isLoading.value = false
}

const loadScores = async () => {
  if (!canLoad.value) {
    message.value = "ログインしてユーザーを指定してください"
    return
  }
  isLoading.value = true
  message.value = "読込中..."
  scores.value = await Api.fetch_score(new Date(0), viewDate.value, userId.value, store.accessToken)
  message.value = scores.value ? "" : "読み込みに失敗しました"
  isLoading.value = false
}

const onChangeTable = async () => {
  const query = Object.assign({}, route.query)
  query.table_id = "" + selectedTableId.value
  await router.replace({ query })
}

onMounted(async () => {
  await loadTablesAndSongs()
  await loadScores()
  updateRowsPerPage()
  window.addEventListener("resize", updateRowsPerPage)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateRowsPerPage)
})

watch(
  () => userId.value,
  async () => {
    await loadScores()
  }
)

watch([searchText, lampFilter, selectedTableId], () => {
  currentPage.value = 1
})
</script>

<template>
  <section id="table-user-page" class="container">
    <header class="hero">
      <div>
        <div class="hero-badge">Difficulty Table</div>
        <h2>難易度表: {{ selectedTableName }}</h2>
        <p class="sub">
          ユーザー: {{ userName || userId }} | 更新日: {{ lastUpdated }}
        </p>
        <div class="hero-meta">
          <label class="meta-label" for="table-select">難易度表</label>
          <select id="table-select" class="form-control form-control-sm" v-model.number="selectedTableId"
            @change="onChangeTable">
            <option v-for="name in tableList" :key="name" :value="tables.get_id_by_name(name)">
              {{ name }}
            </option>
          </select>
        </div>
      </div>
      <div class="hero-actions">
        <button class="btn btn-outline-dark btn-sm" :disabled="isLoading">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          画像エクスポート
        </button>
        <button class="btn btn-outline-dark btn-sm" :disabled="isLoading">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          CSV
        </button>
        <button class="btn btn-outline-dark btn-sm" :disabled="isLoading">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          共有リンク
        </button>
      </div>
    </header>

    <div v-if="message" class="alert alert-warning" role="alert">
      {{ message }}
    </div>

    <section class="summary-grid">
      <div v-for="card in summaryCards" :key="card.label" class="summary-card">
        <div class="summary-label">{{ card.label }}</div>
        <div class="summary-value">{{ card.value }}</div>
      </div>
    </section>

    <section class="panel-grid">
      <div class="panel-box">
        <h3>ランプ分布</h3>
        <div class="lamp-legend">
          <span v-for="lamp in lampIndexDisplay" :key="lamp" class="legend-item">
            <span class="legend-dot" :class="`bg-${lamp}`"></span>
            {{ lamp }}
          </span>
        </div>
        <div class="lamp-level-list">
          <div v-for="row in lampCountsByLevel" :key="row.level" class="lamp-level-row">
            <div class="lamp-level-name">{{ row.level }}</div>
            <div class="lamp-stack" role="img" :aria-label="`ランプ分布 ${row.level}`">
              <div v-for="lamp in lampIndexDisplay" :key="lamp" class="lamp-segment"
                :class="`bg-${lamp}`"
                :style="{ width: ((row.counts[lampIndexMap[lamp]] / row.total) * 100) + '%' }"
                :title="`${lamp}: ${row.counts[lampIndexMap[lamp]]}`">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-box">
        <h3>スコアレート達成率</h3>
        <div class="rate-legend">
          <span class="legend-item"><span class="legend-dot avg"></span>平均</span>
          <span class="legend-item"><span class="legend-dot median"></span>中央値</span>
          <span class="legend-item"><span class="legend-dot p90"></span>上位10%</span>
          <span class="legend-item"><span class="legend-dot p10"></span>上位90%</span>
        </div>
        <div v-if="scoreRateStatsByLevel.length" class="rate-summary">
          <div class="rate-header">
            <span>Level</span>
            <span>平均/中央値/上位10%/上位90%</span>
          </div>
          <div v-for="row in scoreRateStatsByLevel" :key="row.level" class="rate-row">
            <div class="rate-name">{{ row.level }}</div>
            <div class="rate-bar multi"
              :style="{ '--fill': row.avg.toFixed(1) + '%' }"
              v-tooltip="{ content: `平均 ${row.avg.toFixed(1)}% / 中央値 ${row.median.toFixed(1)}% / 上位10% ${row.p90.toFixed(1)}% / 上位90% ${row.p10.toFixed(1)}%`, delay: { show: 100, hide: 0 } }">
              <div class="rate-fill"></div>
              <span class="rate-marker median" :style="{ left: row.median.toFixed(1) + '%' }"></span>
              <span class="rate-marker p90" :style="{ left: row.p90.toFixed(1) + '%' }"></span>
              <span class="rate-marker p10" :style="{ left: row.p10.toFixed(1) + '%' }"></span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">スコアレートの対象データがありません</div>
      </div>
    </section>

    <section class="panel-box">
      <div class="panel-header">
        <h3>最近の更新トップ</h3>
        <div class="filters">
          <button class="btn btn-sm btn-outline-secondary" disabled>
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
            30日
          </button>
        </div>
      </div>
      <div v-if="topUpdates.length" class="top-updates">
        <div v-for="row in topUpdates" :key="row.title" class="update-row">
          <div class="update-title">{{ row.title }}</div>
          <div class="update-meta">{{ row.level }}</div>
          <div class="update-diff">{{ row.diff }}</div>
        </div>
      </div>
      <div v-else class="empty-state">最近の更新はありません</div>
    </section>

    <section class="panel-box">
      <div class="panel-header">
        <h3>曲一覧</h3>
        <div class="filters">
          <input class="form-control form-control-sm" type="text" placeholder="曲名検索" v-model="searchText" />
          <select class="form-control form-control-sm" v-model="lampFilter">
            <option value="all">ランプ全て</option>
            <option value="hard">Hard以上</option>
            <option value="uncleared">未達成</option>
          </select>
          <button class="btn btn-sm btn-outline-secondary" @click="showAllRows = !showAllRows">
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
          <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages" @click="goToNext">
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
              <th>Score</th>
              <th>Last</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.title">
              <td>{{ row.level }}</td>
              <td>{{ row.title }}</td>
              <td>
                <span class="lamp-pill" :class="`lamp-${row.lamp}`">{{ row.lamp }}</span>
              </td>
              <td>{{ row.score }}</td>
              <td>{{ row.last }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!tableRows.length" class="empty-state">該当データがありません</div>
    </section>

    <section class="panel-grid">
      <div class="panel-box">
        <h3>更新タイムライン</h3>
        <ul v-if="timeline.length" class="timeline">
          <li v-for="item in timeline" :key="item.date">
            <span class="timeline-date">{{ item.date }}</span>
            <span class="timeline-text">{{ item.text }}</span>
          </li>
        </ul>
        <div v-else class="empty-state">更新履歴がありません</div>
      </div>
      <div class="panel-box">
        <h3>月間カレンダー</h3>
        <div class="calendar-mini">
          <div v-for="day in calendarDays" :key="day.date" class="calendar-row">
            <span class="calendar-date">{{ day.date.slice(5) }}</span>
            <div class="calendar-bar">
              <div class="calendar-fill" :style="{ width: Math.min(day.count * 12, 100) + '%' }"></div>
            </div>
            <span class="calendar-count">{{ day.count }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;600;700&display=swap");

#table-user-page {
  --ink: #111118;
  --muted: #5b5b66;
  --panel: #ffffff;
  --accent: #ff7f50;
  --accent-2: #2f6bff;
  --surface: #f4f2f0;
  color: var(--ink);
  padding: 20px 0 60px;
  background: radial-gradient(circle at 10% 20%, #fff3e9, transparent 45%),
    radial-gradient(circle at 90% 10%, #e7f5ff, transparent 45%),
    linear-gradient(180deg, #f9f5f0 0%, #ffffff 35%, #f6f7fb 100%);
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  font-family: "Space Grotesk", "Trebuchet MS", sans-serif;
}

#table-user-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#00000012 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.35;
  pointer-events: none;
}

#table-user-page > * {
  position: relative;
  z-index: 1;
}

.hero {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-radius: 12px;
  background: linear-gradient(120deg, #fff0d9, #f8ecff 65%, #d8f5ff);
  margin-bottom: 20px;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
  animation: rise 600ms ease both;
}

.hero h2 {
  font-family: "DM Serif Display", "Georgia", serif;
  letter-spacing: 0.5px;
  margin: 6px 0 2px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: #ffe7d6;
  color: #7a3a1e;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.meta-label {
  font-size: 0.85rem;
  color: var(--muted);
}

.sub {
  margin: 0;
  color: var(--muted);
}

.hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.summary-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-bottom: 20px;
}

.summary-card {
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--panel);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0e7df;
  animation: rise 680ms ease both;
}

.summary-label {
  font-size: 0.85rem;
  color: var(--muted);
}

.summary-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.panel-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  margin-bottom: 20px;
}

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

.lamp-distribution,
.rate-summary {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.lamp-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  font-size: 0.75rem;
  color: var(--muted);
  margin: 8px 0;
}

.lamp-level-list {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.lamp-level-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px;
  align-items: center;
  font-size: 0.85rem;
}

.lamp-level-name {
  font-weight: 600;
  color: #3a3a44;
  font-size: 0.85rem;
}

.lamp-stack {
  display: flex;
  height: 16px;
  border-radius: 0;
  overflow: hidden;
  margin-top: 0;
  background: #eee6de;
  border: 1px solid #e7dfd7;
}

.lamp-segment {
  height: 100%;
}

.lamp-row,
.rate-row {
  display: grid;
  gap: 10px;
  align-items: center;
  font-size: 0.9rem;
}

.lamp-row {
  grid-template-columns: 80px 1fr 40px;
}

.rate-row {
  grid-template-columns: 80px 1fr;
}

.lamp-name,
.rate-name {
  font-weight: 600;
  color: #3a3a44;
}

.lamp-bar,
.rate-bar {
  height: 16px;
  border-radius: 999px;
  background: #eee6de;
  overflow: hidden;
}

.rate-bar {
  background-image: repeating-linear-gradient(
    to right,
    rgba(0, 0, 0, 0.08),
    rgba(0, 0, 0, 0.08) 1px,
    transparent 1px,
    transparent 5%
  );
}

.lamp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff8a5b, #ffb38b);
}

.rate-fill {
  position: absolute;
  inset: 0;
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #6aa7ff);
  clip-path: inset(0 calc(100% - var(--fill, 0%)) 0 0);
}

.rate-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.65) 1px,
    transparent 1px,
    transparent 5%
  );
  background-position: 5% 0;
  pointer-events: none;
}

.lamp-count,
.rate-value {
  text-align: right;
  color: var(--muted);
  font-weight: 600;
}

.rate-header {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.rate-bar.multi {
  position: relative;
  height: 16px;
  overflow: visible;
}

.rate-marker {
  position: absolute;
  top: -6px;
  width: 2px;
  height: 28px;
  z-index: 2;
  background: #2b2b36;
}

.rate-marker.median {
  background: #5b2cc9;
}

.rate-marker.p90 {
  background: #137a6f;
}

.rate-marker.p10 {
  background: #ff7f50;
}

.rate-legend {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--muted);
  margin: 8px 0;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: #2f6bff;
}

.legend-dot.avg {
  background: #6aa7ff;
}

.legend-dot.median {
  background: #5b2cc9;
}

.legend-dot.p90 {
  background: #137a6f;
}

.legend-dot.p10 {
  background: #ff7f50;
}

.calendar-mini {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.calendar-row {
  display: grid;
  grid-template-columns: 60px 1fr 32px;
  gap: 10px;
  align-items: center;
  font-size: 0.85rem;
}

.calendar-date {
  color: #3a3a44;
  font-weight: 600;
}

.calendar-bar {
  height: 8px;
  border-radius: 999px;
  background: #efe9e3;
  overflow: hidden;
}

.calendar-fill {
  height: 100%;
  background: linear-gradient(90deg, #8bd3ff, #2f6bff);
}

.calendar-count {
  text-align: right;
  color: var(--muted);
}

.placeholder {
  display: grid;
  place-items: center;
  height: 160px;
  border-radius: 10px;
  background: repeating-linear-gradient(
    45deg,
    #f4f4f4,
    #f4f4f4 12px,
    #e8e8e8 12px,
    #e8e8e8 24px
  );
  color: #555;
  font-weight: 600;
}

.top-updates {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.update-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f6f2ee;
}

.update-title {
  font-weight: 600;
}

.update-meta {
  color: var(--muted);
}

.update-diff {
  font-weight: 600;
  color: #1a7f37;
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

.timeline {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
}

.timeline li {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f4edff;
}

.timeline-date {
  font-weight: 700;
  color: #5633a5;
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

.table {
  margin-top: 12px;
}

.table thead th {
  border-bottom: 2px solid #ede7e0;
  color: #3b3b42;
}

.table tbody tr {
  transition: background 200ms ease;
}

.table tbody tr:hover {
  background: #fff3e9;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
