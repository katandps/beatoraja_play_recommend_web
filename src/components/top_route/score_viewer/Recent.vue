<template>
  <div id="recent">
    <div class="row align-items-center">
      <display-songs-limiter class="col-sm-6" :filter="filter"/>
    </div>
    <hr/>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col clear" v-if="filter.column_is_active('clear')"/>
          <div class="col level" v-if="filter.column_is_active('level')"/>
          <div class="col title" v-if="filter.column_is_active('title')"/>
          <div class="col update" v-if="filter.column_is_active('clear_update')"/>
          <div class="col update" v-if="filter.column_is_active('rank_update')"/>
          <div class="col update" v-if="filter.column_is_active('score_update')"/>
          <div class="col update" v-if="filter.column_is_active('bp_update')"/>
          <div class="col date" v-if="filter.column_is_active('date')"/>
        </div>

        <div class="thead">
          <div class="tr">
            <header-cell class="clear" :filter="filter" column_name="clear"/>
            <header-cell class="level" :filter="filter" column_name="level">Lv</header-cell>
            <header-cell class="title" :filter="filter" column_name="title">Title</header-cell>
            <header-cell class="update" :filter="filter" column_name="clear_update">Clear</header-cell>
            <header-cell class="update" :filter="filter" column_name="rank_update">Rank</header-cell>
            <header-cell class="update" :filter="filter" column_name="score_update">Score</header-cell>
            <header-cell class="update" :filter="filter" column_name="bp_update">Bp</header-cell>
            <header-cell class="date" :filter="filter" column_name="date">Date</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in model.get_recent_song_list(filter)"
               :key="song.md5"
               :class="clear_type_class(song)" class="tr">
            <data-cell class="clear" :filter="filter" column_name="clear" :class="song.clear_type_bg_class()"/>
            <data-cell class="level" :filter="filter" column_name="level">{{ song.level }}</data-cell>
            <data-cell class="title" :filter="filter" column_name="title" @click="show_modal(song)">{{ song.title }}</data-cell>
            <data-cell class="update" :filter="filter" column_name="clear_update">
              <span v-if="song.clear_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                {{ config().LAMP_INDEX[song.clear_type_before] }}
                <font-awesome-icon :icon="['fas', 'angle-right']"/>
                <span class="update_strong">{{ config().LAMP_INDEX[song.clear_type] }}</span>
              </span>
              <span v-else>-</span>
            </data-cell>
            <data-cell class="update" :filter="filter" column_name="rank_update">
              <span v-if="rank_a(song) !== rank_b(song)&& song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                {{ rank_a(song) }}
                <font-awesome-icon :icon="['fas', 'angle-right']"/>
                <span class="update_strong">{{ rank_b(song) }}</span>
              </span>
              <span v-else>-</span>
            </data-cell>
            <data-cell class="update" :filter="filter" column_name="score_update">
              <span v-if=" song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
               <span class="update_strong">+{{ song.score - song.score_before }}</span> ({{ song.score }})
              </span>
              <span v-else>{{ song.score }}</span>
            </data-cell>
            <data-cell class="update" :filter="filter" column_name="bp_update">
              <span v-if="song.min_bp_updated_at.split('T')[0] !== song.updated_at.split('T')[0]">
                <span class="update_strong">{{ song.min_bp - song.min_bp_before }}</span> ({{ song.min_bp }})
              </span>
              <span v-else><span class="update_strong">new</span>({{ song.min_bp }})</span>
            </data-cell>
            <date-cell :filter="filter" column_name="date" :date="song.updated_at" />
          </div>
        </transition-group>
      </div>
    </div>
    <recent-modal id="recent-list-modal" ref="modal"/>
  </div>
</template>

<script>
import Model from "../../../models/model"
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter"
import config from "../../../const"
import RecentModal from "./RecentModal"
import SongFilter from "../../../models/songFilter"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import SongDetail from "../../../models/song_detail"
import DateCell from "./cell/DateCell"

export default {
  name: "Recent",
  components: {
    DisplaySongsLimiter,
    RecentModal,
    HeaderCell,
    DataCell,
    DateCell
  },
  props: {
    model: {
      type: Model,
      require: true,
    },
    filter: {
      type: SongFilter,
      require: true,
    }
  },
  methods: {
    config() {
      return config
    },
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type]
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
    show_modal(song) {
      this.$refs.modal.show_modal(song)
    },
    rank_a(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score_before)
    },
    rank_b(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score)
    }
  },
}
</script>