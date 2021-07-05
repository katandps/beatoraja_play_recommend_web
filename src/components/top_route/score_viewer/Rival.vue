<template>
  <div id="recent">
    <div class="row">
      <input-user-id :user_id="rival_id" @refresh="refresh_rival_id" class="col-sm-6"/>
      <display-songs-limiter class="col-sm-6" :filter="filter"/>
    </div>
    <TableSelector :model="model" :filter="filter" @setTable="set_table" v-if="model.tables_is_set()"
                   :can_level_select="true"/>
    <hr/>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col clear" v-if="filter.column_is_active('clear')"/>
          <div class="col level" v-if="filter.column_is_active('level')"/>
          <div class="col title" v-if="filter.column_is_active('title')"/>
          <div class="col date" v-if="filter.column_is_active('date')"/>
          <div class="col clear_vs" v-if="filter.column_is_active('clear_diff_rival')"/>
          <div class="col score_vs" v-if="filter.column_is_active('score_diff_rival')"/>
          <div class="col bp_vs" v-if="filter.column_is_active('bp_diff_rival')"/>
          <div class="col date" v-if="filter.column_is_active('rival_date')"/>
        </div>

        <div class="thead">
          <div class="tr">
            <header-cell class="clear" :filter="filter" column_name="clear"/>
            <header-cell class="level" :filter="filter" column_name="level">Lv</header-cell>
            <header-cell class="title" :filter="filter" column_name="title">Title</header-cell>
            <header-cell class="date" :filter="filter" column_name="date">Date</header-cell>
            <header-cell class="clear_vs" :filter="filter" column_name="clear_diff_rival">ClearVS</header-cell>
            <header-cell class="score_vs" :filter="filter" column_name="score_diff_rival">ScoreVS</header-cell>
            <header-cell class="bp_vs" :filter="filter" column_name="bp_diff_rival">BPVS</header-cell>
            <header-cell class="date" :filter="filter" column_name="rival_date">RivalDate</header-cell>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in model.get_sorted_song_list(filter)"
               :key="song.md5"
               :class="clear_type_class(song)" class="tr">
            <data-cell class="clear" :filter="filter" column_name="clear" :class="song.clear_type_bg_class()"/>
            <data-cell class="level" :filter="filter" column_name="level">{{ song.level }}</data-cell>
            <data-cell class="title" :filter="filter" column_name="title" @click="show_modal(song)">{{
                song.title
              }}
            </data-cell>
            <date-cell :filter="filter" column_name="date" :date="song.updated_at" />
            <data-cell class="clear_vs" :filter="filter" column_name="clear_diff_rival"
                       :class="song.clear_type_rival_bg_class()">
              <span v-if="song.clear_type === song.rival_clear_type" class="draw">draw</span>
              <span v-else-if="song.clear_type < song.rival_clear_type" class="lose">lose</span>
              <span v-else class="win">win</span>
            </data-cell>
            <data-cell class="score_vs" :filter="filter" column_name="score_diff_rival">
              <span v-if="song.score === song.rival_score" class="draw">{{ song.score - song.rival_score }}</span>
              <span v-else-if="song.score < song.rival_score" class="lose">{{ song.score - song.rival_score }}</span>
              <span v-else class="win">+{{ song.score - song.rival_score }}</span>
            </data-cell>
            <data-cell class="bp_vs" :filter="filter" column_name="bp_diff_rival">
              <span v-if="song.rival_min_bp === -1 || song.min_bp === -1">-</span>
              <span v-else-if="song.rival_min_bp === song.min_bp" class="draw">{{ song.min_bp - song.rival_min_bp }}</span>
              <span v-else-if="song.rival_min_bp < song.min_bp" class="lose">+{{ song.min_bp - song.rival_min_bp }}</span>
              <span v-else class="win">{{ song.min_bp - song.rival_min_bp }}</span>
            </data-cell>
            <date-cell :filter="filter" column_name="rival_date" :date="song.rival_updated_at" />
          </div>
        </transition-group>
      </div>
    </div>
    <rival-modal id="rival-list-modal" ref="modal"/>
  </div>
</template>

<script>
import Model from "../../../models/model"
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter"
import TableSelector from "./TableSelector"
import InputUserId from "./InputUserId"
import config from "../../../const"
import RivalModal from "./RivalModal"
import SongFilter from "../../../models/songFilter"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import DateCell from "./cell/DateCell"

export default {
  name: "Rival",
  components: {
    DateCell,
    DisplaySongsLimiter,
    TableSelector,
    InputUserId,
    RivalModal,
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
      required: true,
    },
    rival_id: {
      type: Number,
    }
  },
  methods: {
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type]
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
    async refresh_rival_id(rival_id) {
      let query = Object.assign({}, this.$route.query)
      query.rival_id = rival_id
      await this.$router.push({query: query})
    },
    show_modal(song) {
      this.$refs.modal.show_modal(song)
    }
  },
}
</script>