<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import RecentModal from "./modal/RecentModal"
import HeaderCell from "./cell/HeaderCell"
import FilterModal from "./modal/FilterModal"
import RowSong from "./cell/RowSong"
import { ref } from "vue"
import { useStore } from "vuex"

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

// -- methods ---
const showModal = (song) => recent_modal.value.show_modal(song, props.date)
const columnIsActive = (name) => store.getters.column_is_active(name)
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
        <div class="colgroup">
          <div class="col clear" v-if="columnIsActive('clear')" />
          <div class="col level" v-if="columnIsActive('level')" />
          <div class="col title" v-if="columnIsActive('title')" />
          <div class="col update" v-if="columnIsActive('clear_update')" />
          <div class="col update" v-if="columnIsActive('rank_update')" />
          <div class="col update" v-if="columnIsActive('score_update')" />
          <div class="col update" v-if="columnIsActive('bp_update')" />
          <div class="col date" v-if="columnIsActive('date')" />
        </div>

        <div class="thead">
          <div class="tr">
            <header-cell class="clear" column_name="clear" />
            <header-cell class="level" column_name="level">Lv</header-cell>
            <header-cell class="title" column_name="title">Title</header-cell>
            <header-cell class="update" column_name="clear_update"
              >Clear</header-cell
            >
            <header-cell class="update" column_name="rank_update"
              >Rank</header-cell
            >
            <header-cell class="update" column_name="score_update"
              >Score</header-cell
            >
            <header-cell class="update" column_name="bp_update">Bp</header-cell>
            <header-cell class="date" column_name="date">Date</header-cell>
          </div>
        </div>

        <transition-group tag="div" class="tbody" name="flip-list">
          <RowSong
            v-for="song in recent_song_list"
            :key="song.md5"
            :song="song"
            :percentile="percentile"
            @showModal="showModal"
          />
        </transition-group>
      </div>
    </div>
    <recent-modal ref="recent_modal" />
    <filter-modal ref="filter_modal" />
  </div>
</template>
