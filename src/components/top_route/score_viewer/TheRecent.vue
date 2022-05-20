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
      <label class="col-sm-3 btn btn-secondary" @click="show_filter_modal"
        >表示曲設定</label
      >
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col clear" v-if="column_is_active('clear')" />
          <div class="col level" v-if="column_is_active('level')" />
          <div class="col title" v-if="column_is_active('title')" />
          <div class="col update" v-if="column_is_active('clear_update')" />
          <div class="col update" v-if="column_is_active('rank_update')" />
          <div class="col update" v-if="column_is_active('score_update')" />
          <div class="col update" v-if="column_is_active('bp_update')" />
          <div class="col date" v-if="column_is_active('date')" />
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
          <div
            v-for="song in recent_song_list"
            :key="song.md5"
            :class="clear_type_class(song)"
            class="tr"
          >
            <data-cell
              class="clear"
              column_name="clear"
              :class="song.clear_type_bg_class()"
            />
            <data-cell class="level" column_name="level">{{
              song.level
            }}</data-cell>
            <data-cell
              class="title"
              column_name="title"
              @click="show_modal(song)"
              >{{ song.title }}</data-cell
            >
            <clear-update-cell :song="song" />
            <rank-update-cell :song="song" />
            <score-update-cell :song="song" :percentile="percentile" />
            <bp-update-cell :song="song" />
            <date-cell column_name="date" :date="song.updated_at" />
          </div>
        </transition-group>
      </div>
    </div>
    <recent-modal id="recent-list-modal" ref="modal" />
    <filter-modal id="filter-modal" ref="filter_modal" />
  </div>
</template>

<script setup>
import config from "../../../const"
</script>
<script>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import RecentModal from "./modal/RecentModal"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import DateCell from "./cell/DateCell"
import ClearUpdateCell from "./cell/ClearUpdateCell"
import ScoreUpdateCell from "./cell/ScoreUpdateCell"
import RankUpdateCell from "./cell/RankUpdateCell"
import BpUpdateCell from "./cell/BpUpdateCell"
import FilterModal from "./modal/FilterModal"

export default {
  components: {
    BpUpdateCell,
    ScoreUpdateCell,
    RankUpdateCell,
    DisplaySongsLimiter,
    RecentModal,
    HeaderCell,
    DataCell,
    DateCell,
    ClearUpdateCell,
    FilterModal
  },
  props: {
    date: { type: String },
    recent_song_list: { require: true }
  },
  data: () => ({
    percentile: false
  }),
  methods: {
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type]
    },
    show_modal(song) {
      this.$refs.modal.show_modal(song, this.date)
    },
    column_is_active(name) {
      return this.$store.getters.column_is_active(name)
    },
    show_filter_modal() {
      this.$refs.filter_modal.show_modal()
    }
  }
}
</script>
