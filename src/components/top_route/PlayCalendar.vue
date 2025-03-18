<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useLoginStore } from "@/store/session"
import Api from "@/api"
import ColumnModal from "@/components/top_route/score_viewer/modal/ColumnModal.vue"
import RowColGroup from "@/components/top_route/score_viewer/cell/RowColGroup.vue"
import RowHeader from "@/components/top_route/score_viewer/cell/RowHeader.vue"
import RecommendModal from "@/components/top_route/score_viewer/modal/RecommendModal.vue"
import SongModal, { ISongModal } from "@/components/top_route/score_viewer/modal/SongModal.vue"
import RowSong from "@/components/top_route/score_viewer/cell/RowSong.vue"
import Columns from "@/models/columns"
import { DateFormatter } from "@/models/date_formatter"
import SongDetail, { Log } from "@/models/song_detail"
import Tables from "@/models/difficultyTable"

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
const date = ref(new Date(new Date().setHours(9, 0, 0, 0)))
const tables = ref(new Tables([]))
const songs = ref()
const scores = ref()

// --- computed ---
const accessToken = computed(() => sessionStore.accessToken)
const is_login = computed(() => props.is_login || true)
const columns = computed(() => new Columns({}))
const sorted_song_list = computed(() => [new SongDetail()])
const date_str = computed(() => DateFormatter.format(date.value))

// --- method ---
const show_song_modal = async (song: SongDetail) => {
  let score = await Api.fetch_my_score(song.sha256, accessToken.value)
  song_modal.value?.showModal(song, date_str.value, score.log as Log[])
}

// --- initial  load ---
onMounted(() => {
  Api.fetch_calendar_dates(sessionStore.accessToken).then(
    (td) => (dates.value = td)
  )
  Api.fetch_tables(sessionStore.accessToken).then((t) => (tables.value = t))
  Api.fetch_songs(sessionStore.accessToken).then((s) => (songs.value = s))
  Api.fetch_score(date.value, 1, sessionStore.accessToken).then((s) => (scores.value = s))
})
</script>

<template>
  <div id="play_calendar">
    <h2>プレイカレンダー</h2>
    最終アップロードの結果を表示します

    <div v-if="is_login">
      <div class="table-wrapper">
        <div class="score-table detail">
          <RowColGroup :columns="columns" />
          <RowHeader :columns="columns" />
          <div class="tbody">
            <RowSong v-for="song in sorted_song_list" :key="song.md5" :song="song" :columns="columns"
              :percentile="false" @showModal="show_song_modal" />
          </div>
        </div>
        <song-modal ref="song_modal" />
        <ColumnModal :columns="columns" ref="column_modal" />
        <RecommendModal ref="recommend_modal" />
      </div>
    </div>
    <div v-else>ログインが確認できませんでした</div>
  </div>
</template>

<style scoped>
#play_calendar {
  padding-top: 20px;
}
</style>
