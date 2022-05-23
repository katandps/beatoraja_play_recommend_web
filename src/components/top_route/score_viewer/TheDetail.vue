<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import ColumnModal from "./modal/ColumnModal"
import RecommendModal from "./modal/RecommendModal"
import SongModal from "./modal/SongModal"
import RowSong from "./cell/RowSong"
import { ref } from "vue"
import { useStore } from "vuex"
import RowHeader from "./cell/RowHeader.vue"
import RowColGroup from "./cell/RowColGroup.vue"
import { computed } from "@vue/reactivity"

const store = useStore()

// --- refs ---
const recommend_modal = ref(null)
const song_modal = ref(null)
const column_modal = ref(null)

// --- props ---
const props = defineProps({
  sorted_song_list: { type: Array, require: true },
  tables_is_set: { type: Boolean, require: true },
  date: { type: String, require: true },
  table_list: { require: true },
  level_list: { required: true },
  can_level_select: { type: Boolean, required: false }
})

// --- computed ---
const filter = computed(() => store.getters.filter)
const columns = computed(() => filter.value.columns_detail)

// --- methods ---
const show_recommend_modal = () => recommend_modal.value.show_modal()
const show_column_modal = () => column_modal.value.show_modal()
const show_song_modal = (song) => song_modal.value.show_modal(song, props.date)
</script>

<template>
  <div id="detail">
    <div class="form-group row align-items-center">
      <display-songs-limiter class="col-sm-5" />
      <div class="col-sm-7">
        <label class="col-sm-4 btn btn-primary" @click="show_recommend_modal"
          >おまかせ設定</label
        >
        <label class="col-sm-4 btn btn-success" @click="show_column_modal"
          >表示列設定</label
        >
      </div>
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table detail">
        <RowColGroup :columns="columns" />
        <RowHeader :columns="columns" />
        <transition-group tag="div" class="tbody" name="flip-list">
          <RowSong
            v-for="song in sorted_song_list"
            :key="song.md5"
            :song="song"
            :columns="columns"
            @showModal="show_song_modal"
          />
        </transition-group>
      </div>
      <song-modal ref="song_modal" />
      <column-modal :columns="columns" ref="column_modal" />
      <recommend-modal ref="recommend_modal" />
    </div>
  </div>
</template>
