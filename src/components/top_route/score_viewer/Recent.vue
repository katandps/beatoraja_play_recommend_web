<template>
  <div id="recent">
    <div class="row align-items-center">
      <display-songs-limiter class="col-sm-6"/>
    </div>
    <hr/>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col clear" v-if="column_is_active('clear')"/>
          <div class="col level" v-if="column_is_active('level')"/>
          <div class="col title" v-if="column_is_active('title')"/>
          <div class="col update" v-if="column_is_active('clear_update')"/>
          <div class="col update" v-if="column_is_active('rank_update')"/>
          <div class="col update" v-if="column_is_active('score_update')"/>
          <div class="col update" v-if="column_is_active('bp_update')"/>
          <div class="col date" v-if="column_is_active('date')"/>
        </div>

        <div class="thead">
          <div class="tr">
            <header-cell class="clear" column_name="clear"/>
            <header-cell class="level" column_name="level">Lv</header-cell>
            <header-cell class="title" column_name="title">Title</header-cell>
            <header-cell class="update" column_name="clear_update">Clear</header-cell>
            <header-cell class="update" column_name="rank_update">Rank</header-cell>
            <header-cell class="update" column_name="score_update">Score</header-cell>
            <header-cell class="update" column_name="bp_update">Bp</header-cell>
            <header-cell class="date" column_name="date">Date</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in song_list"
               :key="song.md5"
               :class="clear_type_class(song)" class="tr">
            <data-cell class="clear" column_name="clear" :class="song.clear_type_bg_class()"/>
            <data-cell class="level" column_name="level">{{ song.level }}</data-cell>
            <data-cell class="title" column_name="title" @click="show_modal(song)">{{ song.title }}</data-cell>
            <clear-update-cell :song="song" />
            <data-cell class="update" column_name="rank_update">
              <span
                  v-if="rank_a(song) !== rank_b(song)&& song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                {{ rank_a(song) }}
                <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" style="margin-right:0.2em"/>
                <span class="update_strong">{{ rank_b(song) }}</span>
              </span>
              <span v-else>-</span>
            </data-cell>
            <data-cell class="update" column_name="score_update">
              <span v-if="song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
               <span class="update_strong">+{{ song.score - song.score_before }}</span> ({{ song.score }})
              </span>
              <span v-else>{{ song.score }}</span>
            </data-cell>
            <data-cell class="update" column_name="bp_update">
              <span v-if="song.min_bp_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                <span class="update_strong" v-if="song.min_bp_before !== -1">{{
                    song.min_bp - song.min_bp_before
                  }}</span>
                <span class="update_strong" v-else>new</span>
                ({{ song.min_bp }})
              </span>
              <span v-else>{{ song.min_bp }}</span>
            </data-cell>
            <date-cell column_name="date" :date="song.updated_at"/>
          </div>
        </transition-group>
      </div>
    </div>
    <recent-modal id="recent-list-modal" ref="modal"/>
  </div>
</template>

<script>
import Model from "../../../models/model"
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import config from "../../../const"
import RecentModal from "./modal/RecentModal"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import SongDetail from "../../../models/song_detail"
import DateCell from "./cell/DateCell"
import ClearUpdateCell from "./cell/ClearUpdateCell"

export default {
  name: "Recent",
  components: {
    DisplaySongsLimiter,
    RecentModal,
    HeaderCell,
    DataCell,
    DateCell,
    ClearUpdateCell
  },
  props: {
    model: {
      type: Model,
      require: true,
    },
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
      this.$refs.modal.show_modal(song, this.model.get_date_str())
    },
    rank_a(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score_before)
    },
    rank_b(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score)
    },
    column_is_active(name) {
      return this.$store.getters.column_is_active(name)
    }
  },
  computed: {
    /**
     * @returns {SongDetail[]}
     */
    song_list() {
      if (!this.model.is_initialized()) {
        return [SongDetail.dummy()]
      }
      let filter = this.$store.state.filter
      let songs = this.model.tables.get_filtered_score(filter)
      return songs.sort((a, b) => {
        return a.updated_at === b.updated_at ? 0 : (a.updated_at < b.updated_at) ? 1 : -1
      }).slice(0, filter.max_length > 0 ? filter.max_length : songs.length)
    },
  }
}
</script>