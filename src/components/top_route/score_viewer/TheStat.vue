<script setup lang="ts">
import { computed } from "vue"
import config from "../../../const"
import SongDetail from "../../../models/song_detail"

interface Props {
  filtered_score: SongDetail[]
}
const props = defineProps<Props>()

// --- computed ---
const lamp_stat = computed(() =>
  config.LAMP_INDEX.map((lamp, index) =>
    props.filtered_score
      .filter((s) => s.clear_type === index)
      .sort(SongDetail.cmp_title)
  )
)

/**
 * @returns {SongDetail[][]}
 */
const rank_stat = computed(() =>
  config.RANK_TYPE.map((r) =>
    props.filtered_score
      .filter((s) => s.clear_rank === r)
      .sort(SongDetail.cmp_title)
  )
)
const bp_sum = computed(() => {
  let sum = 0
  props.filtered_score
    .filter((s) => s.clear_type !== 0)
    .forEach((song) => (sum += song.min_bp))
  return sum
})
const bp_average = computed(() => {
  let sum = 0
  let songs = props.filtered_score.filter((s) => s.clear_type !== 0)
  songs.forEach((song) => (sum += song.min_bp))
  return (sum / songs.length).toFixed(3)
})
const score_sum = computed(() => {
  let sum = 0
  props.filtered_score
    .filter((s) => s.clear_type !== 0)
    .forEach((song) => (sum += song.score))
  return sum
})
const score_average = computed(() => {
  let sum = 0
  let songs = props.filtered_score.filter((s) => s.clear_type !== 0)
  songs.forEach((song) => (sum += song.score))
  return (sum / songs.length).toFixed(3)
})
const rate_sum = computed(() => {
  let sum = 0
  props.filtered_score
    .filter((s) => s.clear_type !== 0)
    .forEach((song) => (sum += song.score_rate()))
  return sum.toFixed(3)
})
const rate_average = computed(() => {
  let sum = 0
  let songs = props.filtered_score.filter((s) => s.clear_type !== 0)
  songs.forEach((song) => (sum += song.score_rate()))
  return (sum / songs.length).toFixed(3)
})
</script>

<template>
  <div id="stat">
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
    <hr />
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
