<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useLoginStore } from "@/store/session"
import Api from "@/api"
import ColumnModal from "@/components/top_route/score_viewer/modal/ColumnModal.vue"
import RowColGroup from "@/components/top_route/score_viewer/cell/RowColGroup.vue"
import RowHeader from "@/components/top_route/score_viewer/cell/RowHeader.vue"
import RecommendModal from "@/components/top_route/score_viewer/modal/RecommendModal.vue"
import SongModal, {ISongModal} from "@/components/top_route/score_viewer/modal/SongModal.vue"
import RowSong from "@/components/top_route/score_viewer/cell/RowSong.vue"
import Columns from "@/models/columns"
import SongDetail, { Log } from "@/models/song_detail"

const sessionStore = useLoginStore()

// --- refs ---
const song_modal = ref<ISongModal>()

// --- props ---
interface Props {
  is_login: boolean
}

const props = defineProps<Props>()

// --- data ---
const dates = ref()

// --- computed ---
const accessToken = computed(() => sessionStore.accessToken)
const is_login = computed(() => props.is_login || true)
const columns = computed(() =>  new Columns({}))
const sorted_song_list = computed(() => [new SongDetail()])

// --- method ---
const show_song_modal = async (song: SongDetail) => {
  let score = await Api.fetch_my_score(song.sha256, accessToken.value)
  song_modal.value?.showModal(song,new Date(), score.log as Log[])
}

// --- initial  load ---
onMounted(() => {
  Api.fetch_calendar_dates(sessionStore.accessToken).then(
    (td) => (dates.value = td)
  )
})
</script>

<template>
  <div id="play_calendar">
    <h2>プレイカレンダー</h2>

    <div v-if="is_login">
      <div class="table-wrapper">
        <div class="score-table detail">
          <RowColGroup :columns="columns" />
          <RowHeader :columns="columns" />
          <div class="tbody">
            <RowSong
              v-for="song in sorted_song_list"
              :key="song.md5"
              :song="song"
              :columns="columns"
              :percentile="false"
              @showModal="show_song_modal"
            />
          </div>
        </div>
        <song-modal ref="song_modal" />
        <ColumnModal :columns="columns" ref="column_modal" />
        <RecommendModal ref="recommend_modal" />
      </div>
    </div>
    <div v-else>ログインしていないようです</div>
  </div>
</template>

<style scoped>
#play_calendar {
  padding-top: 20px;
}
</style>
