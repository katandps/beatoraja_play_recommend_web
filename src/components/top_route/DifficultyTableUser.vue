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
const normalRanksHighToLow = config.RANK_TYPE.filter((rank) => rank !== "Max")
const normalRanksLowToHigh = [...normalRanksHighToLow].reverse()
const binsPerRank = 10
const totalBins = normalRanksLowToHigh.length * binsPerRank + 1
const maxBinIndex = totalBins - 1
const normalRateSteps = config.RANK_RATE_BY_9.slice(1)
const stepAlphas = [0.3, 0.45, 0.6, 0.8, 1]
const quantile = (sorted: number[], q: number) => {
  if (sorted.length === 0) {
    return 0
  }
  if (sorted.length === 1) {
    return sorted[0]
  }
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  const next = sorted[Math.min(sorted.length - 1, base + 1)]
  return sorted[base] + (next - sorted[base]) * rest
}
const normalBoundsHighToLow = normalRateSteps.map((v, index) => {
  const lower = (v / 9) * 100
  const upper = index === 0 ? 100 : (normalRateSteps[index - 1] / 9) * 100
  return { lower, upper }
})
const normalBoundsLowToHigh = [...normalBoundsHighToLow].reverse()
const clampRate = (rate: number) => Math.max(0, Math.min(100, rate))
const normalWidthPercent = ((totalBins - 1) / totalBins) * 100
const rankBoundaryLabels = computed(() => {
  const count = normalRanksLowToHigh.length
  const labels = normalRanksLowToHigh.map((rank, index) => ({
    label: rank,
    left: `${(normalWidthPercent * (index / count)).toFixed(3)}%`
  }))
  labels.push({ label: "Max", left: "100%" })
  return labels
})

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
  return [
    { label: "総譜面数", value: total.toLocaleString() },
    { label: "ランプ達成率", value: `${rate}%` },
    { label: "平均スコア", value: scoreAvg }
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
  return [...filteredSongs.value]
    .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
    .map((s) => ({
      level: s.level,
      title: s.title,
      titleWrapped: s.title.replace(/([/\-→（）()[\]])/g, "$1\u200B"),
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

const scoreRateBinsByLevel = computed(() => {
  const baseLevels = selectedTable.value?.level_list || []
  const map = new Map<string, number[]>()
  baseLevels.forEach((level) => map.set(level, Array.from({ length: totalBins }, () => 0)))
  tableSongs.value.forEach((s) => {
    if (s.clear_type === 0 || s.total_notes === 0) {
      return
    }
    if (!map.has(s.level)) {
      map.set(s.level, Array.from({ length: totalBins }, () => 0))
    }
    const bins = map.get(s.level)
    if (!bins) {
      return
    }
    const bounded = clampRate(s.score_rate())
    if (bounded >= 100) {
      bins[maxBinIndex] += 1
      return
    }
    const rankIndexHighToLow = Math.max(
      0,
      normalBoundsHighToLow.findIndex((b) => bounded >= b.lower)
    )
    const bounds = normalBoundsHighToLow[rankIndexHighToLow]
    const span = Math.max(bounds.upper - bounds.lower, 0)
    const within = span === 0 ? 0 : bounded - bounds.lower
    const binInRank = span === 0
      ? 0
      : Math.min(binsPerRank - 1, Math.floor((within / span) * binsPerRank))
    const rankIndexLowToHigh = normalRanksLowToHigh.length - 1 - rankIndexHighToLow
    const index = rankIndexLowToHigh * binsPerRank + binInRank
    bins[index] += 1
  })
  return Array.from(map.entries()).map(([level, bins]) => {
    const nonZeroCounts = bins.filter((count) => count > 0)
    const sortedCounts = [...nonZeroCounts].sort((a, b) => a - b)
    const thresholds = [0.2, 0.4, 0.6, 0.8].map((q) => quantile(sortedCounts, q))
    const alphaForCount = (count: number) => {
      if (count <= 0) {
        return 0
      }
      let step = thresholds.findIndex((t) => count <= t)
      if (step === -1) {
        step = thresholds.length
      }
      return stepAlphas[step]
    }
    const segments: {
      len: number
      count: number
      alpha: number
      start: number
      end: number
      rank?: string
      startPercent: number
      endPercent: number
    }[] = []
    const binPercent = (index: number) => {
      if (index === maxBinIndex) {
        return { start: 100, end: 100 }
      }
      const rankIndex = Math.min(normalRanksLowToHigh.length - 1, Math.floor(index / binsPerRank))
      const bounds = normalBoundsLowToHigh[rankIndex]
      const step = (bounds.upper - bounds.lower) / binsPerRank
      const offset = index % binsPerRank
      return {
        start: bounds.lower + step * offset,
        end: bounds.lower + step * (offset + 1)
      }
    }
    let i = 0
    while (i < bins.length) {
      if (i === maxBinIndex) {
        const range = binPercent(i)
        const count = bins[i]
        segments.push({
          len: 1,
          count,
          alpha: alphaForCount(count),
          start: i,
          end: i,
          rank: "Max",
          startPercent: range.start,
          endPercent: range.end
        })
        i += 1
        continue
      }
      const currentRank = Math.min(normalRanksLowToHigh.length - 1, Math.floor(i / binsPerRank))
      const rankEnd = (currentRank + 1) * binsPerRank
      if (bins[i] === 0) {
        let j = i
        while (j < rankEnd && bins[j] === 0) {
          j += 1
        }
        const run = j - i
        if (run >= 5) {
          const startRange = binPercent(i)
          const endRange = binPercent(j - 1)
          segments.push({
            len: run,
            count: 0,
            alpha: 0,
            start: i,
            end: j - 1,
            rank: normalRanksLowToHigh[currentRank],
            startPercent: startRange.start,
            endPercent: endRange.end
          })
          i = j
          continue
        }
      }
      const range = binPercent(i)
      const count = bins[i]
      const rank = normalRanksLowToHigh[currentRank]
      segments.push({
        len: 1,
        count,
        alpha: alphaForCount(count),
        start: i,
        end: i,
        rank,
        startPercent: range.start,
        endPercent: range.end
      })
      i += 1
    }
    return { level, segments }
  })
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
        <div class="lamp-header">
          <span>Level</span>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
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
        <h3>スコアレート分布</h3>
        <div v-if="scoreRateBinsByLevel.length" class="rate-summary">
          <div class="rate-header">
            <span>Level</span>
            <div class="rate-boundary-labels" :style="{ '--bins': totalBins }">
              <span v-for="(rank, index) in rankBoundaryLabels" :key="rank.label"
                class="rate-boundary-label"
                :class="{ 'is-first': index === 0, 'is-last': index === rankBoundaryLabels.length - 1 }"
                :style="{ left: rank.left }">
                {{ rank.label }}
              </span>
            </div>
          </div>
          <div v-for="row in scoreRateBinsByLevel" :key="row.level" class="rate-row">
            <div class="rate-name">{{ row.level }}</div>
            <div class="rate-heat" role="img" :aria-label="`スコアレート分布 ${row.level}`"
              :style="{ '--bins': totalBins }">
              <span v-for="(segment, index) in row.segments" :key="index" class="rate-bin"
                :class="[segment.rank ? `bg-${segment.rank}` : '', segment.count === 0 ? 'is-empty' : '']"
                :style="{ '--alpha': segment.alpha.toFixed(3), '--span': segment.len }"
                v-tooltip="{
                  content: segment.count === 0
                    ? `${segment.startPercent.toFixed(1)}% - ${segment.endPercent.toFixed(1)}%: 0`
                    : `${segment.startPercent.toFixed(1)}% (${segment.rank}): ${segment.count}`,
                  delay: { show: 0, hide: 0 }
                }"></span>
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
              <td v-tooltip="{ content: row.titleWrapped, delay: { show: 100, hide: 0 }, popperClass: 'song-title-tooltip' }">
                {{ row.title }}
              </td>
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

.summary-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.panel-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  margin-bottom: 20px;
  --dist-bar-height: 16px;
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
  font-size: 0.9rem;
}

.lamp-level-name {
  font-weight: 600;
  color: #3a3a44;
  font-size: 0.9rem;
}

.lamp-header {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr;
  gap: 10px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-top: 8px;
}

.lamp-header span:nth-child(2) {
  justify-self: start;
}

.lamp-header span:nth-child(3) {
  justify-self: center;
}

.lamp-header span:nth-child(4) {
  justify-self: end;
}

.lamp-stack {
  display: flex;
  height: var(--dist-bar-height);
  border-radius: 0;
  overflow: hidden;
  margin-top: 0;
  background: #eee6de;
  border: 1px solid #e7dfd7;
  position: relative;
}

.lamp-stack::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc(100% / 10 - 1px),
    rgba(0, 0, 0, 0.18) calc(100% / 10 - 1px),
    rgba(0, 0, 0, 0.18) calc(100% / 10)
  );
  pointer-events: none;
}

.lamp-segment {
  height: 100%;
}

.rate-row {
  display: grid;
  gap: 10px;
  align-items: center;
  font-size: 0.9rem;
  grid-template-columns: 80px 1fr;
}

.rate-name {
  font-weight: 600;
  color: #3a3a44;
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

.rate-boundary-labels {
  position: relative;
  height: 1em;
}

.rate-boundary-label {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  white-space: nowrap;
}

.rate-boundary-label.is-first {
  transform: translateX(0);
}

.rate-boundary-label.is-last {
  transform: translateX(-100%);
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

.rate-heat {
  display: grid;
  grid-template-columns: repeat(var(--bins, 90), minmax(0, 1fr));
  gap: 0;
  height: var(--dist-bar-height);
  background: #646464;
  border: 1px solid #555555;
  position: relative;
}

.rate-heat::before {
  content: "";
  position: absolute;
  inset: 0;
  width: calc((var(--bins, 90) - 1) / var(--bins, 90) * 100%);
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.18) 0,
    rgba(255, 255, 255, 0.18) 1px,
    transparent 1px
  );
  background-size: calc(100% * 5 / (var(--bins, 90) - 1)) 100%;
  background-repeat: repeat;
  pointer-events: none;
}

.rate-bin {
  background: #9aa5b1;
  opacity: var(--alpha);
  grid-column: span var(--span, 1);
}

.rate-bin.is-empty {
  background: transparent !important;
  opacity: 0 !important;
}

.rate-legend .legend-dot.bg-AAA,
.rate-heat .rate-bin.bg-AAA {
  background: #d4af37 !important;
}

.rate-legend .legend-dot.bg-AA,
.rate-heat .rate-bin.bg-AA {
  background: #c0c0c0 !important;
}

.rate-legend .legend-dot.bg-A,
.rate-heat .rate-bin.bg-A {
  background: #cd7f32 !important;
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
