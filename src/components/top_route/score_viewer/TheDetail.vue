<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import HeaderCell from "./cell/HeaderCell"
import FilterModal from "./modal/FilterModal"
import ColumnModal from "./modal/ColumnModal"
import RecommendModal from "./modal/RecommendModal"
import SongModal from "./modal/SongModal"
import RowSong from "./cell/RowSong"
import { ref } from "vue"
import { useStore } from "vuex"

const store = useStore()

// --- refs ---
const recommend_modal = ref(null)
const filter_modal = ref(null)
const song_modal = ref(null)
const column_modal = ref(null)

// --- props ---
const props = defineProps({
  sorted_song_list: { require: true },
  tables_is_set: { type: Boolean, require: true },
  date: { type: String, require: true },
  table_list: { require: true },
  level_list: { required: true },
  can_level_select: { type: Boolean, required: false }
})

// --- computed ---

// --- methods ---
const show_recommend_modal = () => recommend_modal.value.show_modal()
const show_filter_modal = () => filter_modal.value.show_modal()
const show_column_modal = () => column_modal.value.show_modal()
const show_song_modal = (song) => song_modal.value.show_modal(song, props.date)
const column_is_active = (name) => store.getters.column_is_active(name)
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
        <label class="col-sm-4 btn btn-secondary" @click="show_filter_modal"
          >表示曲設定</label
        >
      </div>
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table detail">
        <div class="colgroup">
          <div class="col clear" v-if="column_is_active('clear')" />
          <div class="col date" v-if="column_is_active('clear_date')" />
          <div class="col clear" v-if="column_is_active('clear_before')" />
          <div class="col level" v-if="column_is_active('level')" />
          <div class="col title" v-if="column_is_active('title')" />
          <div class="col rank" v-if="column_is_active('score_rank')" />
          <div class="col rank" v-if="column_is_active('detail_rank')" />
          <div class="col rate" v-if="column_is_active('rate')" />
          <div class="col score" v-if="column_is_active('score')" />
          <div class="col date" v-if="column_is_active('score_date')" />
          <div class="col score" v-if="column_is_active('score_before')" />
          <div class="col bp" v-if="column_is_active('bp')" />
          <div class="col date" v-if="column_is_active('bp_date')" />
          <div class="col bp" v-if="column_is_active('bp_before')" />
          <div class="col combo" v-if="column_is_active('combo')" />
          <div class="col play" v-if="column_is_active('play')" />
          <div class="col date" v-if="column_is_active('date')" />
        </div>
        <div class="thead">
          <div class="tr">
            <header-cell class="clear" column_name="clear" />
            <header-cell class="date" column_name="clear_date"
              >Date(clear)</header-cell
            >
            <header-cell class="clear" column_name="clear_before" />
            <header-cell class="level" column_name="level">Lv</header-cell>
            <header-cell class="title" column_name="title">Title</header-cell>
            <header-cell class="rank" column_name="score_rank"
              >Rank</header-cell
            >
            <header-cell class="rank" column_name="detail_rank"
              >DRank</header-cell
            >
            <header-cell class="rate" column_name="rate">Rate</header-cell>
            <header-cell class="score" column_name="score">Ex/Max</header-cell>
            <header-cell class="date" column_name="score_date"
              >Date(Score)</header-cell
            >
            <header-cell class="score" column_name="score_before"
              >Ex(old)</header-cell
            >
            <header-cell class="bp" column_name="bp">BP</header-cell>
            <header-cell class="date" column_name="bp_date"
              >Date(BP)</header-cell
            >
            <header-cell class="bp" column_name="bp_before"
              >BP(old)</header-cell
            >
            <header-cell class="combo" column_name="combo">Combo</header-cell>
            <header-cell class="play" column_name="play">Play</header-cell>
            <header-cell class="date" column_name="date">Date</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <RowSong
            v-for="song in sorted_song_list"
            :key="song.md5"
            :song="song"
            @showModal="show_song_modal"
          />
        </transition-group>
      </div>
    </div>
    <song-modal ref="song_modal" />
    <filter-modal ref="filter_modal" />
    <column-modal ref="column_modal" />
    <recommend-modal ref="recommend_modal" />
  </div>
</template>
