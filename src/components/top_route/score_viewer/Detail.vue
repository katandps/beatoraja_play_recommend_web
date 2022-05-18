<template>
  <div id="detail">
    <TableSelector
      :table_list="table_list"
      :level_list="level_list"
      :selected_table="selected_table"
      :selected_level="selected_level"
      @setTable="set_table"
      @setLevel="set_level"
      v-if="tables_is_set"
      :can_level_select="true"
    />
    <div class="form-group row align-items-center">
      <display-songs-limiter class="col-sm-5"/>
      <div class="col-sm-7">
        <label class="col-sm-4 btn btn-primary" @click="show_recommend_modal">おまかせ設定</label>
        <label class="col-sm-4 btn btn-success" @click="show_column_modal">表示列設定</label>
        <label class="col-sm-4 btn btn-secondary" @click="show_filter_modal">表示曲設定</label>
      </div>
    </div>
    <hr>
    <div class="table-wrapper">
      <div class="score-table detail">
        <div class="colgroup">
          <div class="col clear" v-if="column_is_active('clear')"/>
          <div class="col date" v-if="column_is_active('clear_date')"/>
          <div class="col clear" v-if="column_is_active('clear_before')"/>
          <div class="col level" v-if="column_is_active('level')"/>
          <div class="col title" v-if="column_is_active('title')"/>
          <div class="col rank" v-if="column_is_active('score_rank')"/>
          <div class="col rank" v-if="column_is_active('detail_rank')"/>
          <div class="col rate" v-if="column_is_active('rate')"/>
          <div class="col score" v-if="column_is_active('score')"/>
          <div class="col date" v-if="column_is_active('score_date')"/>
          <div class="col score" v-if="column_is_active('score_before')"/>
          <div class="col bp" v-if="column_is_active('bp')"/>
          <div class="col date" v-if="column_is_active('bp_date')"/>
          <div class="col bp" v-if="column_is_active('bp_before')"/>
          <div class="col combo" v-if="column_is_active('combo')"/>
          <div class="col play" v-if="column_is_active('play')"/>
          <div class="col date" v-if="column_is_active('date')"/>
        </div>
        <div class="thead">
          <div class="tr">
            <header-cell class="clear" column_name="clear"/>
            <header-cell class="date" column_name="clear_date">Date(clear)</header-cell>
            <header-cell class="clear" column_name="clear_before"/>
            <header-cell class="level" column_name="level">Lv</header-cell>
            <header-cell class="title" column_name="title">Title</header-cell>
            <header-cell class="rank" column_name="score_rank">Rank</header-cell>
            <header-cell class="rank" column_name="detail_rank">DRank</header-cell>
            <header-cell class="rate" column_name="rate">Rate</header-cell>
            <header-cell class="score" column_name="score">Ex/Max</header-cell>
            <header-cell class="date" column_name="score_date">Date(Score)</header-cell>
            <header-cell class="score" column_name="score_before">Ex(old)</header-cell>
            <header-cell class="bp" column_name="bp">BP</header-cell>
            <header-cell class="date" column_name="bp_date">Date(BP)</header-cell>
            <header-cell class="bp" column_name="bp_before">BP(old)</header-cell>
            <header-cell class="combo" column_name="combo">Combo</header-cell>
            <header-cell class="play" column_name="play">Play</header-cell>
            <header-cell class="date" column_name="date">Date</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div
              v-for="song in sorted_song_list"
              :key="song.md5"
              class="tr"
              :class="clear_type_class(song)"
              :song="song"
          >
            <data-cell class="clear" column_name="clear" :class="song.clear_type_bg_class()"/>
            <date-cell column_name="clear_date" :date="song.clear_updated_at"/>
            <data-cell class="clear" column_name="clear_before"
                       :class="song.clear_type_before_bg_class()"/>
            <data-cell class="level" column_name="level">{{ song.level }}</data-cell>
            <data-cell class="title" column_name="title" @click="show_song_modal(song)">
              {{ song.title }}
            </data-cell>
            <rank-cell :song="song" />
            <detail-rank-cell :song="song" />
            <data-cell class="rate" column_name="rate" :class="'bg-' + song.clear_rank">
              {{ song.score_rate_format(song.score) }}
            </data-cell>
            <data-cell class="score" column_name="score">
              {{ `${song.score}/${song.total_notes * 2}` }}
            </data-cell>
            <date-cell column_name="score_date" :date="song.score_updated_at"/>
            <data-cell class="score" column_name="score_before">{{ song.score_before }}</data-cell>
            <data-cell class="bp" column_name="bp">
              {{ song.min_bp === -1 || song.min_bp === 2147483647 ? '---' : song.min_bp }}
            </data-cell>
            <date-cell column_name="bp_date" :date="song.min_bp_updated_at"/>
            <data-cell class="bp" column_name="bp_before">
              {{ song.min_bp_before === -1 ? '---' : song.min_bp_before }}
            </data-cell>
            <data-cell class="combo" column_name="combo">{{ song.max_combo }}</data-cell>
            <data-cell class="play" column_name="play" v-if="song.play_count !== -1">{{ song.play_count }}</data-cell>
            <data-cell class="play" column_name="play" v-else>---</data-cell>
            <date-cell column_name="date" :date="song.updated_at"/>
          </div>
        </transition-group>
      </div>
    </div>
    <song-modal id="song-list-modal" ref="song_modal"/>
    <filter-modal id="filter-modal" ref="filter_modal"/>
    <column-modal id="column-modal" ref="column_modal"/>
    <recommend-modal id="recommend-modal" ref="recommend_modal"/>
  </div>
</template>

<script>
import TableSelector from "./selector/TableSelector"
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import SongModal from "./modal/SongModal"
import config from "../../../const"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import DateCell from "./cell/DateCell"
import RankCell from "./cell/RankCell"
import DetailRankCell from "./cell/DetailRankCell"
import FilterModal from "./modal/FilterModal"
import ColumnModal from "./modal/ColumnModal"
import RecommendModal from "./modal/RecommendModal"

export default {
  name: "Detail",
  components: {
    DateCell,
    TableSelector,
    DisplaySongsLimiter,
    HeaderCell,
    DataCell,
    RankCell,
    DetailRankCell,
    SongModal,
    FilterModal,
    ColumnModal,
    RecommendModal
  },
  props: {
    sorted_song_list: {require: true},
    tables_is_set: { type: Boolean, require: true },
    date: { type: String, require: true },
    table_list: { require: true},
    level_list: { required: true },
    can_level_select: { type: Boolean, required: false },
    selected_table: { type: String, required: true },
    selected_level: { type: String, required: true }
  },
  methods: {
    set_table(table) {
      this.$emit('setTable', table)
    },
    set_level(level) {
      this.$emit('setLevel', level)
    },
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type];
    },
    show_recommend_modal() {
      this.$refs.recommend_modal.show_modal()
    },
    show_filter_modal() {
      this.$refs.filter_modal.show_modal()
    },
    show_column_modal() {
      this.$refs.column_modal.show_modal()
    },
    show_song_modal(song) {
      this.$refs.song_modal.show_modal(song, this.date)
    },
    column_is_active(name) {
      return this.$store.getters.column_is_active(name)
    }
  },
  computed: {
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>