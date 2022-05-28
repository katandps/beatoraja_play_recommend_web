<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import ColumnModal from "./modal/ColumnModal"
import RecommendModal from "./modal/RecommendModal"
import SongModal from "./modal/SongModal"
import RowSong from "./cell/RowSong"
import { ref } from "vue"
import RowHeader from "./cell/RowHeader.vue"
import RowColGroup from "./cell/RowColGroup.vue"
import { computed } from "@vue/reactivity"
import SongFilter from "@/models/songFilter"

// --- refs ---
const recommend_modal = ref(null)
const song_modal = ref(null)
const column_modal = ref(null)

// --- props ---
const props = defineProps({
  sorted_song_list: { type: Array, require: true },
  date: { type: String, require: true },
  filter: { type: SongFilter, require: true }
})

// --- computed ---
const columns = computed(() => props.filter.columns)

// --- methods ---
const show_recommend_modal = () => recommend_modal.value.showModal()
const show_column_modal = () => column_modal.value.showModal()
const show_song_modal = (song) => song_modal.value.showModal(song, props.date)
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
      <label class="col-sm-2 btn btn-success" @click="filter.default()">
        デフォルト
      </label>
      <label class="col-sm-2 btn btn-success" @click="filter.for_recent()">
        直近の更新
      </label>
    </div>
    <hr />
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
            @showModal="show_song_modal"
          />
        </div>
      </div>
      <song-modal ref="song_modal" />
      <ColumnModal :columns="columns" ref="column_modal" />
      <RecommendModal ref="recommend_modal" />
    </div>
  </div>
</template>
