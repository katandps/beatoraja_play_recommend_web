<script setup lang="ts">
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter.vue"
import ColumnModal, { IColumnModal } from "./modal/ColumnModal.vue"
import RecommendModal, { IRecommendModal } from "./modal/RecommendModal.vue"
import SongModal, { ISongModal } from "./modal/SongModal.vue"
import RowSong from "./cell/RowSong.vue"
import { ref } from "vue"
import RowHeader from "./cell/RowHeader.vue"
import RowColGroup from "./cell/RowColGroup.vue"
import { computed } from "@vue/reactivity"
import SongFilter from "@/models/songFilter"
import SongDetail, { Log } from "@/models/song_detail"
import Api from "@/api"
import { useLoginStore } from "@/store/session"

const loginStore = useLoginStore()

// --- refs ---
const recommend_modal = ref<IRecommendModal>()
const song_modal = ref<ISongModal>()
const column_modal = ref<IColumnModal>()

// --- props ---
interface Props {
  user_id: number
  sorted_song_list: SongDetail[]
  date: string
  filter: SongFilter,
}
const props = defineProps<Props>()

// --- computed ---
const columns = computed(() => props.filter?.columns)
const accessToken = computed(() => loginStore.accessToken)

// --- methods ---
const show_recommend_modal = () => recommend_modal.value?.showModal()
const show_column_modal = () => column_modal.value?.showModal()
const show_song_modal = async (song: SongDetail) => {
  let score = await Api.fetch_score_log(props.user_id, song.sha256, accessToken.value)
  song_modal.value?.showModal(song, props.date, score.log as Log[])
}
</script>

<template>
  <div id="detail">
    <div class="form-group row align-items-center">
      <display-songs-limiter class="col-sm-4" />
      <label class="col-sm-2 btn btn-primary" @click="show_recommend_modal">
        プリセット
      </label>
      <label class="col-sm-2 btn btn-success" @click="show_column_modal">
        列設定
      </label>
      <label class="col-sm-2 btn btn-success" @click="filter?.default()">
        デフォルト
      </label>
      <label class="col-sm-2 btn btn-success" @click="filter?.for_recent()">
        直近の更新
      </label>
      <label class="col-sm-2 btn btn-success" @click="filter?.for_rival()">
        ライバル比較
      </label>
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table detail">
        <RowColGroup :columns="columns" />
        <RowHeader :columns="columns" />
        <div class="tbody">
          <RowSong v-for="song in sorted_song_list" :key="song.md5" :song="song" :columns="columns" :percentile="false"
            @showModal="show_song_modal" />
        </div>
      </div>
      <song-modal ref="song_modal" />
      <ColumnModal :columns="columns" ref="column_modal" />
      <RecommendModal ref="recommend_modal" />
    </div>
  </div>
</template>
