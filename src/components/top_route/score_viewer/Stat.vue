<template>
  <div id="stat">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()" :can_level_select="true"/>
    <label class="col-sm-3 btn btn-secondary" @click="show_filter_modal">表示曲設定</label>
    <hr>
    <h3>クリアランプ分布</h3>
    <div class="row">
      <div class="col-sm-3" v-for="(type, index) in config().LAMP_INDEX" :key="type">
        <div class="card">
          <div class="card-header">{{ type }}</div>
          <div class="card-body">{{ lamp_stat[index].length }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">Sum</div>
          <div class="card-body">{{ filtered.length }}</div>
        </div>
      </div>
    </div>
    <hr>
    <h3>スコアランク分布</h3>
    <div class="row">
      <div class="col-sm-2" v-for="(type, index) in config().RANK_TYPE" :key="type">
        <div class="card">
          <div class="card-header">{{ type }}</div>
          <div class="card-body">{{ rank_stat[index].length }}</div>
        </div>
      </div>
      <div class="col-sm-2">
        <div class="card">
          <div class="card-header">Sum</div>
          <div class="card-body">{{ filtered.length }}</div>
        </div>
      </div>
    </div>
    <hr>
    <h3>BP状況</h3>
    <div class="row">
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">合計</div>
          <div class="card-body">{{ bp_sum }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">平均</div>
          <div class="card-body">{{ bp_average }}</div>
        </div>
      </div>
    </div>
    <hr>
    <h3>スコア</h3>
    <div class="row">
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">合計</div>
          <div class="card-body">{{ score_sum }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">平均</div>
          <div class="card-body">{{ score_average }}</div>
        </div>
      </div>
    </div>
    <h3>スコアレート</h3>
    <div class="row">
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">合計</div>
          <div class="card-body">{{ rate_sum }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">平均</div>
          <div class="card-body">{{ rate_average }}</div>
        </div>
      </div>
    </div>
    <filter-modal id="filter-modal" ref="filter_modal"/>
  </div>
</template>

<script>
import TableSelector from "./selector/TableSelector"
import Model from "../../../models/model"
import config from "../../../const.js"
import SongDetail from "../../../models/song_detail"
import FilterModal from "./modal/FilterModal"

export default {
  name: "Stat",
  components: {TableSelector, FilterModal},
  props: {
    model: {
      type: Model,
      require: true
    },
  },
  methods: {
    config() {
      return config
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model.set_table(table)
    },
    show_filter_modal() {
      this.$refs.filter_modal.show_modal()
    },
  },
  computed: {
    /**
     * @returns {SongDetail[][]}
     */
    lamp_stat() {
      let songs = this.filtered
      return config.LAMP_INDEX.map(
          (lamp, index) => songs.filter(s => s.clear_type === index).sort(SongDetail.cmp_title)
      )
    },

    /**
     * @returns {SongDetail[][]}
     */
    rank_stat() {
      let songs = this.filtered
      return config.RANK_TYPE.map(
          r => songs.filter(s => s.clear_rank === r).sort(SongDetail.cmp_title)
      )
    },
    bp_sum() {
      let sum = 0
      this.filtered.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.min_bp)
      return sum
    },
    bp_average() {
      let sum = 0
      let songs = this.filtered.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.min_bp)
      return (sum / songs.length).toFixed(3)
    },
    score_sum() {
      let sum = 0
      this.filtered.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.score)
      return sum
    },
    score_average() {
      let sum = 0
      let songs = this.filtered.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.score)
      return (sum / songs.length).toFixed(3)
    },
    rate_sum() {
      let sum = 0
      this.filtered.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.score_rate())
      return sum.toFixed(3)
    },
    rate_average() {
      let sum = 0
      let songs = this.filtered.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.score_rate())
      return (sum / songs.length).toFixed(3)
    },
    /**
     * @returns {SongDetail[]}
     */
    filtered() {
      if (!this.model.is_initialized()) {
        return []
      }
      let songs = this.model.filtered_score(this.$store.state.filter)
      if (!this.$store.state.filter.visible_all_levels) {
        songs = songs.filter(s => s.level === this.model.selected_level)
      }
      return songs
    },
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>
