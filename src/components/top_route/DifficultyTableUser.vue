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
  const paramId = parseInt(route.params.user_id as string)
  if (Number.isFinite(paramId) && paramId > 0) {
    return paramId
  }
  const queryId = parseInt(route.query.user_id as string)
  if (Number.isFinite(queryId) && queryId > 0) {
    return queryId
  }
  return store.userInfo?.user_id || 0
})

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
  const base = 420
  const rowHeight = 36
  const height = Math.max(window.innerHeight - base, 200)
  const autoRows = Math.max(20, Math.min(maxAutoRows, Math.floor(height / rowHeight)))
  rowsPerPage.value = autoRows
  currentPage.value = Math.max(1, currentPage.value)
}

const lastUpdated = computed(() => buildLastUpdated(tableSongs.value))

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
    <DifficultyTableUserHeader v-model:selectedTableId="selectedTableId" :selectedTableName="selectedTableName"
      :userName="userName" :userId="userId" :lastUpdated="lastUpdated" :tableOptions="tableOptions"
      :isLoading="isLoading" @changeTable="onChangeTable" />

    <div v-if="message" class="alert alert-warning" role="alert">
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
