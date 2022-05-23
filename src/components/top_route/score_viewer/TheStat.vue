<template>
  <div id="stat">
    <h3>クリアランプ分布</h3>
    <div class="row">
      <div
        class="col-sm-3"
        v-for="(type, index) in config.LAMP_INDEX"
        :key="type"
      >
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
    <hr />
    <h3>スコアランク分布</h3>
    <div class="row">
      <div
        class="col-sm-2"
        v-for="(type, index) in config.RANK_TYPE"
        :key="type"
      >
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
    <hr />
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
    <hr />
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
  </div>
</template>

<script setup>
import config from "../../../const"
</script>

<script>
import SongDetail from "../../../models/song_detail"

export default {
  props: {
    filtered_score: { require: true },
    table_list: {},
    level_list: {}
  },
  computed: {
    /**
     * @returns {SongDetail[][]}
     */
    lamp_stat() {
      return config.LAMP_INDEX.map((lamp, index) =>
        this.filtered_score
          .filter((s) => s.clear_type === index)
          .sort(SongDetail.cmp_title)
      )
    },

    /**
     * @returns {SongDetail[][]}
     */
    rank_stat() {
      return config.RANK_TYPE.map((r) =>
        this.filtered_score
          .filter((s) => s.clear_rank === r)
          .sort(SongDetail.cmp_title)
      )
    },
    bp_sum() {
      let sum = 0
      this.filtered_score
        .filter((s) => s.clear_type !== 0)
        .forEach((song) => (sum += song.min_bp))
      return sum
    },
    bp_average() {
      let sum = 0
      let songs = this.filtered_score.filter((s) => s.clear_type !== 0)
      songs.forEach((song) => (sum += song.min_bp))
      return (sum / songs.length).toFixed(3)
    },
    score_sum() {
      let sum = 0
      this.filtered_score
        .filter((s) => s.clear_type !== 0)
        .forEach((song) => (sum += song.score))
      return sum
    },
    score_average() {
      let sum = 0
      let songs = this.filtered_score.filter((s) => s.clear_type !== 0)
      songs.forEach((song) => (sum += song.score))
      return (sum / songs.length).toFixed(3)
    },
    rate_sum() {
      let sum = 0
      this.filtered_score
        .filter((s) => s.clear_type !== 0)
        .forEach((song) => (sum += song.score_rate()))
      return sum.toFixed(3)
    },
    rate_average() {
      let sum = 0
      let songs = this.filtered_score.filter((s) => s.clear_type !== 0)
      songs.forEach((song) => (sum += song.score_rate()))
      return (sum / songs.length).toFixed(3)
    },
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>
