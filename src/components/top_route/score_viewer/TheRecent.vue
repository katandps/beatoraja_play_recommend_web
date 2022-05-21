<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import RecentModal from "./modal/RecentModal"
import FilterModal from "./modal/FilterModal"
import RowSong from "./cell/RowSong"
import { computed, ref } from "vue"
import RowColGroup from "./cell/RowColGroup.vue"
import { useStore } from "vuex"
import RowHeader from "./cell/RowHeader.vue"

const store = useStore()
// --- refs ---
const recent_modal = ref(null)
const filter_modal = ref(null)

// --- props ---
const props = defineProps({
  date: { type: String },
  recent_song_list: { require: true }
})

// --- data ---
const percentile = ref(false)

// --- computed ---
const columns = computed(() => store.getters.filter.columns_recent)

// -- methods ---
const showModal = (song) => recent_modal.value.show_modal(song, props.date)
const showFilterModal = () => filter_modal.value.show_modal()
</script>

<template>
  <div id="recent">
    <div class="row align-items-center">
      <display-songs-limiter class="col-sm-4" />
      <div class="col-sm-4" v-tooltip="'スコア差分を百分率で表示します'">
        <input
          class="btn-check"
          type="checkbox"
          id="percentile"
          v-model="percentile"
        />
        <label class="btn btn-outline-info" for="percentile">
          パーセント表示
          <font-awesome-icon :icon="['fas', 'question-circle']" />
        </label>
      </div>
      <label class="col-sm-3 btn btn-secondary" @click="showFilterModal"
        >表示曲設定</label
      >
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table">
        <RowColGroup :columns="columns" />
        <RowHeader :columns="columns" />
        <transition-group tag="div" class="tbody" name="flip-list">
          <RowSong
            v-for="song in recent_song_list"
            :key="song.md5"
            :song="song"
            :percentile="percentile"
            :columns="columns"
            @showModal="showModal"
          />
        </transition-group>
      </div>
    </div>
    <recent-modal ref="recent_modal" />
    <filter-modal ref="filter_modal" />
  </div>
</template>
