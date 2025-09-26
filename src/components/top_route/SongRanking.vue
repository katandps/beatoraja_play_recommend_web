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

onBeforeMount(() =>
  Api.fetch_ranking(store.accessToken, props.sha256, new Date()).then(
    r => ranking.value = r.song.sha256 === "" ? null : r
  )
)
</script>

<template>
  <div>
    <div v-if="ranking" style="padding-top: 20px">
      <div>
        <div>{{ ranking.song.title }}</div>
        <div>{{ ranking.song.notes }} notes</div>
      </div>
      <div class="table-wrapper">
        <div class="score-table">
          <div class="thead">
            <div class="tr">
              <div class="th sort_inactive">User</div>
              <div class="th score sort_inactive">Score</div>
              <div class="th bp sort_inactive">BP</div>
              <div class="th combo sort_inactive">Combo</div>
              <div class="th clear sort_inactive">Clear</div>
              <div class="th date sort_inactive">Date</div>
            </div>
          </div>
          <div class="tbody">
            <div class="tr" v-for="(score, user_id) in ranking.score" :key="user_id">
              <div class="th">
                <router-link :to="{ path: 'view', query: Object.assign({}, $route.query, { user_id: user_id }) }">
                  {{ score[0] }}
                </router-link>
              </div>
              <div class="th">{{ score[1].score ? score[1].score.current : '-' }}</div>
              <div class="th">{{ score[1].min_bp ? score[1].min_bp.current : '-' }}</div>
              <div class="th">{{ score[1].max_combo }}</div>
              <div class="th">{{ score[1].clear_type ? config.LAMP_TYPE[10 - score[1].clear_type.current] :
                config.LAMP_TYPE[10]
                }}</div>
              <div class="th">{{ score[1].updated_at.toISOString() }}</div>
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