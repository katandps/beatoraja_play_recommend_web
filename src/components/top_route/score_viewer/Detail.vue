<template>
  <div id="detail">
    <TableSelector :model="model" :filter="filter" @setTable="set_table" v-if="model.tables_is_set()"
                   :can_level_select="true"/>
    <div class="form-group row align-items-center">
      <display-songs-limiter :filter="filter" class="col-sm-6"/>
    </div>
    <hr>
    <FilterPreset :filter="filter"/>
    <SongFilterController :filter="filter"/>
    <DetailColumns :filter="filter"/>
    <hr>
    <div class="table-wrapper">
      <div class="score-table detail">
        <div class="colgroup">
          <div class="col clear" v-if="filter.column_is_active('clear')"/>
          <div class="col date" v-if="filter.column_is_active('clear_date')"/>
          <div class="col clear" v-if="filter.column_is_active('clear_before')"/>
          <div class="col level" v-if="filter.column_is_active('level')"/>
          <div class="col title" v-if="filter.column_is_active('title')"/>
          <div class="col rate" v-if="filter.column_is_active('rate')"/>
          <div class="col score" v-if="filter.column_is_active('score')"/>
          <div class="col date" v-if="filter.column_is_active('score_date')"/>
          <div class="col score" v-if="filter.column_is_active('score_before')"/>
          <div class="col bp" v-if="filter.column_is_active('bp')"/>
          <div class="col date" v-if="filter.column_is_active('bp_date')"/>
          <div class="col bp" v-if="filter.column_is_active('bp_before')"/>
          <div class="col combo" v-if="filter.column_is_active('combo')"/>
          <div class="col play" v-if="filter.column_is_active('play')"/>
          <div class="col date" v-if="filter.column_is_active('date')"/>
        </div>
        <div class="thead">
          <div class="tr">
            <header-cell class="clear" :filter="filter" column_name="clear"/>
            <header-cell class="date" :filter="filter" column_name="clear_date">Date(clear)</header-cell>
            <header-cell class="clear" :filter="filter" column_name="clear_before"/>
            <header-cell class="level" :filter="filter" column_name="level">Lv</header-cell>
            <header-cell class="title" :filter="filter" column_name="title">Title</header-cell>
            <header-cell class="rate" :filter="filter" column_name="rate">Rate</header-cell>
            <header-cell class="score" :filter="filter" column_name="score">Ex/Max</header-cell>
            <header-cell class="date" :filter="filter" column_name="score_date">Date(Score)</header-cell>
            <header-cell class="score" :filter="filter" column_name="score_before">Ex(old)</header-cell>
            <header-cell class="bp" :filter="filter" column_name="bp">BP</header-cell>
            <header-cell class="date" :filter="filter" column_name="bp_date">Date(BP)</header-cell>
            <header-cell class="bp" :filter="filter" column_name="bp_before">BP(old)</header-cell>
            <header-cell class="combo" :filter="filter" column_name="combo">Combo</header-cell>
            <header-cell class="play" :filter="filter" column_name="play">Play</header-cell>
            <header-cell class="date" :filter="filter" column_name="date">Date</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div
              v-for="song in model.get_sorted_song_list(filter)"
              :key="song.md5"
              class="tr"
              :class="clear_type_class(song)"
              :song="song"
          >
            <data-cell :filter="filter" column_name="clear" :class="song.clear_type_bg_class()"/>
            <data-cell :filter="filter" column_name="clear_date">{{ song.clear_updated_at.split("T")[0] }}</data-cell>
            <data-cell :filter="filter" column_name="clear_before" :class="song.clear_type_before_bg_class()"/>
            <data-cell :filter="filter" column_name="level">{{ song.level }}</data-cell>
            <data-cell :filter="filter" column_name="title" @click="show_modal">{{ song.title }}</data-cell>
            <data-cell :filter="filter" column_name="rate" :class="'bg-' + song.clear_rank">{{ song.score_rate_format(song.score) }}</data-cell>
            <data-cell :filter="filter" column_name="score">{{ `${song.score}/${song.total_notes * 2}` }}</data-cell>
            <data-cell :filter="filter" column_name="score_date">{{ song.score_updated_at.split("T")[0] }}</data-cell>
            <data-cell :filter="filter" column_name="score_before">{{ song.score_before }}</data-cell>
            <data-cell :filter="filter" column_name="bp">{{ song.min_bp }}</data-cell>
            <data-cell :filter="filter" column_name="bp_date">{{ song.min_bp_updated_at.split("T")[0] }}</data-cell>
            <data-cell :filter="filter" column_name="bp_before">{{ song.min_bp_before }}</data-cell>
            <data-cell :filter="filter" column_name="combo">{{ song.max_combo }}</data-cell>
            <data-cell :filter="filter" column_name="play">{{ song.play_count }}</data-cell>
            <data-cell :filter="filter" column_name="date">{{ song.updated_at.split("T")[0] }}</data-cell>
          </div>
        </transition-group>
      </div>
      <song-modal id="song-list-modal" ref="song_modal"/>
    </div>
  </div>
</template>

<script>
import TableSelector from "./TableSelector"
import SongFilterController from "./detail/SongFilterController"
import DetailColumns from "./detail/DetailColumns"
import FilterPreset from "./detail/FilterPreset"
import Model from "../../../models/model"
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter"
import SongModal from "./SongModal"
import config from "../../../const"
import SongFilter from "../../../models/songFilter"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"

export default {
  name: "Detail",
  components: {
    TableSelector,
    DisplaySongsLimiter,
    FilterPreset,
    DetailColumns,
    SongFilterController,
    SongModal,
    HeaderCell,
    DataCell
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
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type];
    },
    show_modal(song) {
      this.$refs.song_modal.show_modal(song)
    }
  }
}
</script>

<style scoped></style>