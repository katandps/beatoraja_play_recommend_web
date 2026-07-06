<script setup lang="ts">
import { useLoginStore } from "@/store/session";
import { onBeforeMount, ref } from "vue";
import Api from "../../api"
import ClearSymbol from "@/components/parts/clear_symbol.vue"
import SongDetail from "@/models/song_detail";
import Score from "@/models/score";
import Song from "@/models/song";
import { RankingD, ScoreElement } from "@/types/generated/ranking";

const store = useLoginStore()

interface Props {
  sha256: string
}
const props = defineProps<Props>()

const song = ref<Song | null>(null)
const scores = ref<{ user_id: number; user_name: string; score: SongDetail }[]>([])
const sortKey = ref<string>('score')
const sortOrder = ref<string>('desc')
const loadError = ref<string>("")


function getSortedScores() {
  if (!scores.value || !song.value) return [];
  return [...scores.value].sort((a, b) =>
    SongDetail.cmp(
      a.score,
      b.score,
      sortKey.value,
      sortOrder.value == "desc",
      []
    )
  )
}

function setSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'desc';
  }
}

async function fetchRanking() {
  if (!props.sha256) return

  try {
    const r: RankingD = await Api.fetch_ranking(store.accessToken, props.sha256)
    if (!r || !r.song || typeof r.song.sha256 !== "string" || !Array.isArray(r.score)) {
      loadError.value = "Failed to parse ranking response."
      return
    }

    if (r.song.sha256 !== "") {
      scores.value = r.score
        .map((s: ScoreElement) => {
          let score = new SongDetail()
          let ss = new Score()
          console.log(s)
          ss.set_score(s.score)
          score.init_score(ss)
          score.init_song(r.song, r.song.sha256)
          return { user_id: s.user_id, user_name: s.user_name, score: score }
        })
      song.value = r.song
    }
  } catch (e) {
    loadError.value = "Failed to load ranking."
    console.error(e)
  }
}

onBeforeMount(fetchRanking)
</script>

<template>
  <div>
    <div v-if="song" style="padding-top: 20px">
      <div class="song-card">
        <div class="song-card-header">
          <span class="song-title">{{ song?.title }}</span>
        </div>
        <div class="song-card-body">
          <span class="song-notes">Notes: {{ song?.notes }}</span>
          <!-- 追加情報があればここに -->
        </div>
      </div>

      <div class="table-wrapper">
        <div class="score-table rich">
          <div class="thead">
            <div class="tr">
              <div class="th" :class="{ active: sortKey === 'user' }" @click="setSort('user')">
                User Name <span v-if="sortKey === 'user'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th score" :class="{ active: sortKey === 'score' }" @click="setSort('score')">
                Score <span v-if="sortKey === 'score'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th score-rate" :class="{ active: sortKey === 'score-rate' }" @click="setSort('score-rate')">
                Score rate <span v-if="sortKey === 'score-rate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th bp" :class="{ active: sortKey === 'bp' }" @click="setSort('bp')">
                Miss Count <span v-if="sortKey === 'bp'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th combo" :class="{ active: sortKey === 'combo' }" @click="setSort('combo')">
                Max Combo <span v-if="sortKey === 'combo'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th clear" :class="{ active: sortKey === 'clear' }" @click="setSort('clear')">
                Clear <span v-if="sortKey === 'clear'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th" :class="{ active: sortKey === 'date' }" @click="setSort('date')">
                Date <span v-if="sortKey === 'date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="tr" v-for="item in getSortedScores()" :key="item.user_id">
              <div class="th">
                <router-link :to="{ path: 'view', query: Object.assign({}, $route.query, { user_id: item.user_id }) }">
                  {{ item.user_name }}
                </router-link>
              </div>
              <div class="th score">{{ item.score.get("score") }}</div>
              <div class="th score-rate">{{ item.score.get("rate") }}%</div>
              <div class="th bp">{{ item.score.get("bp") }}</div>
              <div class="th combo">{{ item.score.get("combo") }}</div>
              <div class="th clear">
                <ClearSymbol :row="item.score" />
              </div>
              <div class="th">{{ item.score.get("date") }}</div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
    <div v-else-if="loadError">
      {{ loadError }}
    </div>
    <div v-else>
      Song is not selected.
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;600;700&display=swap");

.score-table .th.score-rate,
.score-table .tbody .th.score-rate {
  text-align: right;
  min-width: 80px;
  max-width: 110px;
  color: #388e3c;
  font-weight: 500;
}

.score-table .th.score,
.score-table .tbody .th.score {
  text-align: right;
  min-width: 80px;
  max-width: 110px;
}

.score-table .th.bp,
.score-table .tbody .th.bp {
  text-align: right;
  min-width: 80px;
  max-width: 110px;
}

.score-table .th.combo,
.score-table .tbody .th.combo {
  text-align: right;
  min-width: 80px;
  max-width: 110px;
}

/* リッチなテーブルデザイン */
.score-table.rich {
  background: #fafbfc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 16px 24px;
  margin-bottom: 24px;
  width: 100%;
  max-width: none;
}

.table-wrapper {
  width: 100%;
  max-width: none;
}

.score-table .thead .tr {
  display: flex;
  font-weight: bold;
  background: #f0f4f8;
  border-bottom: 2px solid #e0e4e8;
}

.score-table .th {
  flex: 1;
  padding: 12px 8px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-table .th.score,
.score-table .tbody .th.score {
  text-align: right;
}

.score-table .th.bp,
.score-table .tbody .th.bp {
  text-align: right;
}

.score-table .th.combo,
.score-table .tbody .th.combo {
  text-align: right;
}

.score-table .th.clear,
.score-table .tbody .th.clear {
  text-align: center;
}

.score-table .th:nth-child(1) {
  /* User */
  min-width: 140px;
  max-width: 220px;
}

.score-table .th:nth-child(6) {
  /* Date */
  min-width: 120px;
  max-width: 180px;
}

.score-table .th.active {
  color: #1976d2;
  background: #e3f2fd;
}

.score-table .tbody .tr {
  display: flex;
  border-bottom: 1px solid #e0e4e8;
  transition: 0.2s;
}

.score-table .tbody .tr:hover {
  background: #f5faff;
}

.score-table .tbody .th {
  flex: 1;
  padding: 12px 8px;
  text-align: left;
}

/* カード風デザイン */
.song-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px 32px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.song-card-header {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.song-title {
  letter-spacing: 0.05em;
}

.song-card-body {
  font-size: 1rem;
  color: #666;
}

.song-notes {
  font-weight: 500;
}
</style>