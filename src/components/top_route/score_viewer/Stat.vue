<template>
  <div id="stat">
    <TableSelector
      :table_list="table_list"
      :level_list="level_list"
      :selected_table="selected_table"
      :selected_level="selected_level"
      :visible_all_level="visible_all_level"
      @setTable="set_table"
      @setLevel="set_level"
      @setVisibleAllLevelsFlag="set_visible_all_levels_flag"
      :can_level_select="true"
    />
    <label class="col-sm-3 btn btn-secondary" @click="show_filter_modal">表示曲設定</label>
    <hr>
    <h3>クリアランプ分布</h3>
    <div class="row">
      <div class="col-sm-3" v-for="(type, index) in config.LAMP_INDEX" :key="type">
        <div class="card">
          <div class="card-header">{{ type }}</div>
          <div class="card-body">{{ lamp_stat[index].length }}</div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">Sum</div>
          <div class="card-body">{{ filtered_score.length }}</div>
        </div>
      </div>
    </div>
    <hr>
    <h3>スコアランク分布</h3>
    <div class="row">
      <div class="col-sm-2" v-for="(type, index) in config.RANK_TYPE" :key="type">
        <div class="card">
          <div class="card-header">{{ type }}</div>
          <div class="card-body">{{ rank_stat[index].length }}</div>
        </div>
      </div>
      <div class="col-sm-2">
        <div class="card">
          <div class="card-header">Sum</div>
          <div class="card-body">{{ filtered_score.length }}</div>
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

<script setup>
import config from "../../../const.js"
</script>

<script>
import TableSelector from "./selector/TableSelector"
import SongDetail from "../../../models/song_detail"
import FilterModal from "./modal/FilterModal"
import { DifficultyTable } from '../../../models/difficultyTable'

export default {
  name: "Stat",
  components: {TableSelector, FilterModal},
  props: {
    filtered_score: { require: true },
    table_list: {},
    level_list: {},
    selected_table: { type: DifficultyTable },
    selected_level: { require:true },
    visible_all_level: { type: Boolean, require: true } 
  },
  methods: {
    /**
     * @param {string} table
     */
    set_table(table) {
      this.$emit('setTable', table)
    },
    set_level(level) {
      this.$emit('setLevel', level)
    },
    set_visible_all_levels_flag(flag) {
      this.$emit('setVisibleAllLevelsFlag', flag)
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
      return config.LAMP_INDEX.map(
          (lamp, index) => this.filtered_score.filter(s => s.clear_type === index).sort(SongDetail.cmp_title)
      )
    },

    /**
     * @returns {SongDetail[][]}
     */
    rank_stat() {
      return config.RANK_TYPE.map(
          r => this.filtered_score.filter(s => s.clear_rank === r).sort(SongDetail.cmp_title)
      )
    },
    bp_sum() {
      let sum = 0
      this.filtered_score.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.min_bp)
      return sum
    },
    bp_average() {
      let sum = 0
      let songs = this.filtered_score.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.min_bp)
      return (sum / songs.length).toFixed(3)
    },
    score_sum() {
      let sum = 0
      this.filtered_score.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.score)
      return sum
    },
    score_average() {
      let sum = 0
      let songs = this.filtered_score.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.score)
      return (sum / songs.length).toFixed(3)
    },
    rate_sum() {
      let sum = 0
      this.filtered_score.filter(s =>  s.clear_type !== 0).forEach(song => sum += song.score_rate())
      return sum.toFixed(3)
    },
    rate_average() {
      let sum = 0
      let songs = this.filtered_score.filter(s =>  s.clear_type !== 0)
      songs.forEach(song => sum += song.score_rate())
      return (sum / songs.length).toFixed(3)
    },
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>
