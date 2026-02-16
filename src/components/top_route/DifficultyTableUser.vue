<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import Api from "@/api"
import Tables from "@/models/difficultyTable"
import Songs from "@/models/songs"
import Scores from "@/models/scores"
import { useLoginStore } from "@/store/session"
import {
  buildLastUpdated,
  buildSummaryCards,
  buildTableSongs
} from "@/models/difficultyTableUser"
import { copyToClipboard } from "@/utils/clipboard"
import { buildTableUserShareUrl, getTableIdFromRoute, getUserIdFromRoute } from "@/utils/route"
import { buildViewDate, calcRowsPerPage } from "@/utils/tableUser"
import DifficultyTableUserHeader from "@/components/top_route/difficulty_table_user/DifficultyTableUserHeader.vue"
import DifficultyTableUserDistributions from "@/components/top_route/difficulty_table_user/DifficultyTableUserDistributions.vue"
import DifficultyTableUserPickup from "@/components/top_route/difficulty_table_user/DifficultyTableUserPickup.vue"
import DifficultyTableUserSongList from "@/components/top_route/difficulty_table_user/DifficultyTableUserSongList.vue"

const store = useLoginStore()
const route = useRoute()
const router = useRouter()

const tables = ref<Tables>(Tables.default())
const songs = ref<Songs | null>(null)
const scores = ref<Scores | null>(null)
const selectedTableId = ref<number>(0)
const searchText = ref("")
const lampFilter = ref("all")
const isLoadingTables = ref(false)
const isLoadingScores = ref(false)
const message = ref("")
const messageKind = ref<"warning" | "success">("warning")
const currentPage = ref(1)
const rowsPerPage = ref(50)
const showAllRows = ref(false)
const maxAutoRows = 100
let messageTimer: number | null = null

const viewDate = ref(buildViewDate())

const userId = computed(() => getUserIdFromRoute(route, store.userInfo?.user_id || 0))

const canLoad = computed(() => !!store.accessToken && userId.value > 0)
const tableList = computed(() => tables.value.name_list())
const tableOptions = computed(() =>
  tableList.value.map((name) => ({ name, id: tables.value.get_id_by_name(name) }))
)
const selectedTable = computed(() =>
  tables.value.tables.find((t) => t.id === selectedTableId.value) || tables.value.first()
)
const selectedTableName = computed(() => selectedTable.value?.name || "未選択")
const userName = computed(() => scores.value?.name || "")

const tableSongs = computed(() => buildTableSongs(scores.value, songs.value, selectedTable.value))

const summaryCards = computed(() => buildSummaryCards(tableSongs.value))

const updateRowsPerPage = () => {
  rowsPerPage.value = calcRowsPerPage(window.innerHeight, {
    base: 420,
    rowHeight: 36,
    minRows: 20,
    maxRows: maxAutoRows
  })
  currentPage.value = Math.max(1, currentPage.value)
}

const lastUpdated = computed(() => buildLastUpdated(tableSongs.value))

const setMessage = (text: string, kind: "warning" | "success" = "warning", autoClearMs?: number) => {
  message.value = text
  messageKind.value = kind
  if (messageTimer) {
    window.clearTimeout(messageTimer)
    messageTimer = null
  }
  if (autoClearMs) {
    messageTimer = window.setTimeout(() => {
      message.value = ""
      messageTimer = null
    }, autoClearMs)
  }
}

const loadTablesAndSongs = async () => {
  if (!store.accessToken) {
    setMessage("ログインしてください")
    return
  }
  isLoadingTables.value = true
  try {
    tables.value = await Api.fetch_tables(store.accessToken)
    songs.value = await Api.fetch_songs(store.accessToken)
    const queryTableId = getTableIdFromRoute(route)
    const fallbackTable = tables.value.first()
    if (queryTableId && tables.value.tables.some((t) => t.id === queryTableId)) {
      selectedTableId.value = queryTableId
    } else if (fallbackTable) {
      selectedTableId.value = fallbackTable.id
    }
  } finally {
    isLoadingTables.value = false
  }
}

const loadScores = async () => {
  if (!canLoad.value) {
    setMessage("ログインしてユーザーを指定してください")
    return
  }
  isLoadingScores.value = true
  setMessage("読込中...")
  try {
    scores.value = await Api.fetch_score(new Date(0), viewDate.value, userId.value, store.accessToken)
    setMessage(scores.value ? "" : "読み込みに失敗しました")
  } finally {
    isLoadingScores.value = false
  }
}

const isLoading = computed(() => isLoadingTables.value || isLoadingScores.value)

const onShareLink = async () => {
  if (userId.value <= 0) {
    setMessage("ユーザーを指定してください")
    return
  }
  const shareUrl = buildTableUserShareUrl(
    router,
    { userId: userId.value, tableId: selectedTableId.value },
    window.location.origin
  )
  const copied = await copyToClipboard(shareUrl)
  if (copied) {
    setMessage("共有リンクをコピーしました", "success", 3000)
    return
  }
  setMessage("共有リンクのコピーに失敗しました")
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
  if (messageTimer) {
    window.clearTimeout(messageTimer)
    messageTimer = null
  }
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
    <DifficultyTableUserHeader v-model:selectedTableId="selectedTableId" :selectedTableName="selectedTableName"
      :userName="userName" :userId="userId" :lastUpdated="lastUpdated" :tableOptions="tableOptions"
      :isLoading="isLoading" @changeTable="onChangeTable" @shareLink="onShareLink" />

    <div v-if="message" class="alert" :class="messageKind === 'success' ? 'alert-success' : 'alert-warning'"
      role="alert">
      {{ message }}
    </div>

    <section class="summary-grid">
      <div v-for="card in summaryCards" :key="card.label" class="summary-card"
        v-tooltip="card.tooltip ? { content: card.tooltip, delay: { show: 0, hide: 0 } } : undefined">
        <div class="summary-label">{{ card.label }}</div>
        <div class="summary-value">{{ card.value }}</div>
      </div>
    </section>

    <DifficultyTableUserDistributions :tableSongs="tableSongs" :baseLevels="selectedTable?.level_list || []" />

    <DifficultyTableUserPickup :tableSongs="tableSongs" />

    <DifficultyTableUserSongList v-model:searchText="searchText" v-model:lampFilter="lampFilter"
      v-model:showAllRows="showAllRows" v-model:currentPage="currentPage" :tableSongs="tableSongs"
      :rowsPerPage="rowsPerPage" />

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

#table-user-page>* {
  position: relative;
  z-index: 1;
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
