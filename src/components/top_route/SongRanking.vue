<script setup lang="ts">
import { useLoginStore } from "@/store/session";
import { onBeforeMount, ref } from "vue";
import Api from "../../api"
import config from "../../const"

const store = useLoginStore()

interface Props {
  sha256: string
}
const props = defineProps<Props>()

const ranking = ref()
const sortKey = ref('score')
const sortOrder = ref('desc')


function getSortedScores() {
  if (!ranking.value || !ranking.value.score) return [];
  const totalNotes = ranking.value.song.notes || 0;
  const maxScore = totalNotes * 2;
  const arr = Object.entries(ranking.value.score).map(([user_id, score]) => {
    const currentScore = score[1].score ? score[1].score.current : 0;
    const rate = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;
    return { user_id, score, rate };
  });
  return arr.sort((a, b) => {
    let vA, vB;
    switch (sortKey.value) {
      case 'user':
        vA = a.score[0]; vB = b.score[0]; break;
      case 'score':
        vA = a.score[1].score ? a.score[1].score.current : -Infinity;
        vB = b.score[1].score ? b.score[1].score.current : -Infinity;
        break;
      case 'score-rate':
        vA = a.rate;
        vB = b.rate;
        break;
      case 'bp':
        vA = a.score[1].min_bp ? a.score[1].min_bp.current : Infinity;
        vB = b.score[1].min_bp ? b.score[1].min_bp.current : Infinity;
        break;
      case 'combo':
        vA = a.score[1].max_combo || 0;
        vB = b.score[1].max_combo || 0;
        break;
      case 'clear':
        vA = a.score[1].clear_type ? a.score[1].clear_type.current : 10;
        vB = b.score[1].clear_type ? b.score[1].clear_type.current : 10;
        break;
      case 'date':
        vA = a.score[1].updated_at;
        vB = b.score[1].updated_at;
        break;
      default:
        vA = 0; vB = 0;
    }
    if (sortOrder.value === 'asc') {
      return vA > vB ? 1 : vA < vB ? -1 : 0;
    } else {
      return vA < vB ? 1 : vA > vB ? -1 : 0;
    }
  });
}

function setSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'desc';
  }
}

onBeforeMount(() =>
  Api.fetch_ranking(store.accessToken, props.sha256).then(
    r => ranking.value = r.song.sha256 === "" ? null : r
  )
)
</script>

<template>
  <div>
    <div v-if="ranking" style="padding-top: 20px">
      <div class="song-card">
        <div class="song-card-header">
          <span class="song-title">{{ ranking.song.title }}</span>
        </div>
        <div class="song-card-body">
          <span class="song-notes">Notes: {{ ranking.song.notes }}</span>
          <!-- 追加情報があればここに -->
        </div>
      </div>

      <div class="table-wrapper">
        <div class="score-table rich">
          <div class="thead">
            <div class="tr">
              <div class="th" :class="{active: sortKey==='user'}" @click="setSort('user')">
                User Name <span v-if="sortKey==='user'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th score" :class="{active: sortKey==='score'}" @click="setSort('score')">
                Score <span v-if="sortKey==='score'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th score-rate" :class="{active: sortKey==='score-rate'}" @click="setSort('score-rate')">
                Score rate <span v-if="sortKey==='score-rate'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th bp" :class="{active: sortKey==='bp'}" @click="setSort('bp')">
                Miss Count <span v-if="sortKey==='bp'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th combo" :class="{active: sortKey==='combo'}" @click="setSort('combo')">
                Max Combo <span v-if="sortKey==='combo'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th clear" :class="{active: sortKey==='clear'}" @click="setSort('clear')">
                Clear <span v-if="sortKey==='clear'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
              <div class="th" :class="{active: sortKey==='date'}" @click="setSort('date')">
                Date <span v-if="sortKey==='date'">{{ sortOrder==='asc' ? '▲' : '▼' }}</span>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="tr" v-for="item in getSortedScores()" :key="item.user_id">
              <div class="th">
                <router-link :to="{ path: 'view', query: Object.assign({}, $route.query, { user_id: item.user_id }) }">
                  {{ item.score[0] }}
                </router-link>
              </div>
              <div class="th score">{{ item.score[1].score ? item.score[1].score.current : '-' }}</div>
              <div class="th score-rate">{{ item.rate.toFixed(2) }}%</div>
              <div class="th bp">{{ item.score[1].min_bp ? item.score[1].min_bp.current : '-' }}</div>
              <div class="th combo">{{ item.score[1].max_combo }}</div>
              <div class="th clear">
                <span class="lamp-pill" :class="`lamp-${item.score[1].clear_type ? config.LAMP_TYPE[10 - item.score[1].clear_type.current] : config.LAMP_TYPE[10]}`">
                  {{ item.score[1].clear_type ? config.LAMP_TYPE[10 - item.score[1].clear_type.current] : config.LAMP_TYPE[10] }}
                </span>
              </div>
              <div class="th">{{ item.score[1].updated_at.split('T')[0] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
    <div v-else>
      Song is not selected.
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;600;700&display=swap");

/* Lamp装飾（DifficultyTableUserSongListより移植） */
.lamp-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Segoe UI', 'Meiryo', 'sans-serif';
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
  background: #c6ffd6;
  color: #1e6a2a;
}
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
.score-table .th:nth-child(1) { /* User */
  min-width: 140px;
  max-width: 220px;
}
.score-table .th:nth-child(6) { /* Date */
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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