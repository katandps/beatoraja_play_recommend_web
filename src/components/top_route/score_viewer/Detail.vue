<template>
  <div id="detail">
    <TableSelector :model="model" :filter="filter" @setTable="set_table" v-if="model.tables_is_set()"
                   :can_level_select="true"/>
    <div class="form-group row align-items-center">
      <display-songs-limiter :model="model" class="col-sm-6"/>
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
            <div class="th clear" v-if="filter.column_is_active('clear')"
                 :class="filter.sort_key_is_active('clear')"
                 @click="filter.set_sort('clear')"/>
            <div class="th date" v-if="filter.column_is_active('clear_date')"
                 :class="filter.sort_key_is_active('clear_date')"
                 @click="filter.set_sort('clear_date')">Date(clear)
            </div>
            <div class="th clear" v-if="filter.column_is_active('clear_before')"
                 :class="filter.sort_key_is_active('clear_before')"
                 @click="filter.set_sort('clear_before')"/>
            <div class="th level" v-if="filter.column_is_active('level')"
                 :class="filter.sort_key_is_active('level')"
                 @click="filter.set_sort('level')">Lv
            </div>
            <div class="th title" v-if="filter.column_is_active('title')"
                 :class="filter.sort_key_is_active('title')"
                 @click="filter.set_sort('title')">Title
            </div>
            <div class="th rate" v-if="filter.column_is_active('rate')"
                 :class="filter.sort_key_is_active('rate')"
                 @click="filter.set_sort('rate')">Rate
            </div>
            <div class="th score" v-if="filter.column_is_active('score')"
                 :class="filter.sort_key_is_active('score')"
                 @click="filter.set_sort('score')">Ex/Max
            </div>
            <div class="th date" v-if="filter.column_is_active('score_date')"
                 :class="filter.sort_key_is_active('score_date')"
                 @click="filter.set_sort('score_date')">Date(Score)
            </div>
            <div class="th score" v-if="filter.column_is_active('score_before')"
                 :class="filter.sort_key_is_active('score_before')"
                 @click="filter.set_sort('score_before')">Ex(old)
            </div>
            <div class="th bp" v-if="filter.column_is_active('bp')"
                 :class="filter.sort_key_is_active('bp')"
                 @click="filter.set_sort('bp')">BP
            </div>
            <div class="th date" v-if="filter.column_is_active('bp_date')"
                 :class="filter.sort_key_is_active('bp_date')"
                 @click="filter.set_sort('bp_date')">Date(BP)
            </div>
            <div class="th bp" v-if="filter.column_is_active('bp_before')"
                 :class="filter.sort_key_is_active('bp_before')"
                 @click="filter.set_sort('bp_before')">BP(old)
            </div>
            <div class="th combo" v-if="filter.column_is_active('combo')"
                 :class="filter.sort_key_is_active('combo')"
                 @click="filter.set_sort('combo')">Combo
            </div>
            <div class="th play" v-if="filter.column_is_active('play')"
                 :class="filter.sort_key_is_active('play')"
                 @click="filter.set_sort('play')">Play
            </div>
            <div class="th date" v-if="filter.column_is_active('date')"
                 :class="filter.sort_key_is_active('date')"
                 @click="filter.set_sort('date')">Date
            </div>
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
            <clear-cell :song="song" :filter="filter"/>
            <clear-date-cell :song="song" :filter="filter"/>
            <clear-before-cell :song="song" :filter="filter"/>
            <level-cell :song="song" :filter="filter"/>
            <title-cell :song="song" :filter="filter" @click="show_modal(song)"/>
            <rate-cell :song="song" :filter="filter"/>
            <score-cell :song="song" :filter="filter"/>
            <score-date-cell :song="song" :filter="filter"/>
            <score-before-cell :song="song" :filter="filter"/>
            <min-bp-cell :song="song" :filter="filter"/>
            <min-bp-date-cell :song="song" :filter="filter"/>
            <min-bp-before-cell :song="song" :filter="filter"/>
            <combo-cell :song="song" :filter="filter"/>
            <play-count-cell :song="song" :filter="filter"/>
            <date-cell :song="song" :filter="filter"/>
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
import ClearCell from "./cell/ClearCell"
import ClearDateCell from "./cell/ClearDateCell"
import ClearBeforeCell from "./cell/ClearBeforeCell"
import LevelCell from "./cell/LevelCell"
import TitleCell from "./cell/TitleCell"
import RateCell from "./cell/RateCell"
import ScoreCell from "./cell/ScoreCell"
import ScoreDateCell from "./cell/ScoreDateCell"
import ScoreBeforeCell from "./cell/ScoreBeforeCell"
import MinBpCell from "./cell/MinBpCell";
import MinBpDateCell from "./cell/MinBpDateCell";
import MinBpBeforeCell from "./cell/MinBpBeforeCell";
import ComboCell from "./cell/ComboCell";
import PlayCountCell from "./cell/PlayCountCell";
import DateCell from "./cell/DateCell";

export default {
  name: "Detail",
  components: {
    DateCell,
    PlayCountCell,
    ComboCell,
    MinBpBeforeCell,
    MinBpDateCell,
    MinBpCell,
    ScoreBeforeCell,
    ScoreDateCell,
    ScoreCell,
    RateCell,
    TitleCell,
    LevelCell,
    ClearBeforeCell,
    ClearDateCell,
    ClearCell,
    TableSelector,
    DisplaySongsLimiter,
    FilterPreset,
    DetailColumns,
    SongFilterController,
    SongModal,
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