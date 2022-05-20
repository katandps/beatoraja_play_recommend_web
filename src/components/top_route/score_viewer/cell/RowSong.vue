<script setup>
import SongDetail from "../../../../models/song_detail"
import DataCell from "./DataCell"
import config from "../../../../const"
import { computed } from "vue"
import DateCell from "./DateCell.vue"
import ClearUpdateCell from "./ClearUpdateCell"
import RankUpdateCell from "./RankUpdateCell.vue"
import BpUpdateCell from "./BpUpdateCell.vue"
import ScoreUpdateCell from "./ScoreUpdateCell.vue"
import DetailRankCell from "./DetailRankCell.vue"
import RankCell from "./RankCell.vue"

// --- props ---
const props = defineProps({
  song: { type: SongDetail },
  percentile: { type: Boolean }
})

// --- emits ---
const emits = defineEmits(["showModal"])

// --- computed ---
const clear_class = computed(
  () => "table-line-" + config.LAMP_INDEX[props.song.clear_type]
)
const clear_bg_class = computed(
  () => "bg-" + config.LAMP_INDEX[props.song.clear_type] + props.song.clear_type
)
const clear_before_bg_class = computed(() =>
  props.song.clear_type_before_bg_class()
)
const clear_rival_bg_class = computed(() =>
  props.song.clear_type_rival_bg_class()
)
const clear_rank_bg_class = computed(() => "bg-" + props.song.clear_rank)

const level = computed(() => props.song.level)
const title = computed(() => props.song.title)
const clear_diff = computed(() =>
  props.song.clear_type === props.song.rival_clear_type
    ? "draw"
    : props.song.clear_type < props.song.rival_clear_type
    ? "lose"
    : "win"
)
const score_diff = computed(() =>
  props.song.score === 0 || props.song.rival_score === 0
    ? "-"
    : props.song.score - props.song.rival_score
)
const score_diff_class = computed(() =>
  score_diff.value === 0 ? "draw" : score_diff.value < 0 ? "lose" : "win"
)
const bp_diff = computed(() =>
  props.song.min_bp === -1 ||
  props.song.min_bp === 2147483647 ||
  props.song.rival_min_bp === -1 ||
  props.song.rival_min_bp === 2147483647
    ? "-"
    : props.song.min_bp - props.song.rival_min_bp
)
const bp_diff_class = computed(() =>
  bp_diff.value === 0 ? "draw" : bp_diff.value < 0 ? "win" : "lose"
)

// --- method ---
const showModal = () => emits("showModal", props.song)
</script>

<template>
  <div class="tr" :class="clear_class">
    <DataCell class="clear" column_name="clear" :class="clear_bg_class" />
    <DateCell column_name="clear_date" :date="song.clear_updated_at" />
    <DataCell
      class="clear"
      column_name="clear_before"
      :class="clear_before_bg_class"
    />
    <DataCell class="level" column_name="level">{{ level }} </DataCell>
    <DataCell class="title" column_name="title" @click="showModal()">{{
      title
    }}</DataCell>
    <DateCell column_name="date" :date="song.updated_at" />
    <DetailRankCell :song="song" />
    <RankCell :song="song" />
    <DataCell class="rate" column_name="rate" :class="clear_rank_bg_class">
      {{ song.score_rate_format(song.score) }}
    </DataCell>
    <DataCell class="score" column_name="score">
      {{ `${song.score}/${song.total_notes * 2}` }}
    </DataCell>
    <DateCell column_name="score_date" :date="song.score_updated_at" />
    <DataCell class="score" column_name="score_before">
      {{ song.score_before }}
    </DataCell>

    <DataCell
      class="clear_vs"
      column_name="clear_diff_rival"
      :class="clear_rival_bg_class"
      ><span :class="clear_diff">{{ clear_diff }}</span>
    </DataCell>
    <DataCell class="score_vs" column_name="score_diff_rival">
      <span :class="score_diff_class">{{ score_diff }}</span>
    </DataCell>

    <DateCell column_name="rival_date" :date="song.rival_updated_at" />

    <DataCell class="bp" column_name="bp">
      {{
        song.min_bp === -1 || song.min_bp === 2147483647 ? "---" : song.min_bp
      }}
    </DataCell>
    <DateCell column_name="bp_date" :date="song.min_bp_updated_at" />
    <DataCell class="bp" column_name="bp_before">
      {{ song.min_bp_before === -1 ? "---" : song.min_bp_before }}
    </DataCell>
    <DataCell class="bp_vs" column_name="bp_diff_rival">
      <span :class="bp_diff_class">{{ bp_diff }}</span>
    </DataCell>

    <DataCell class="combo" column_name="combo">{{ song.max_combo }}</DataCell>
    <DataCell class="play" column_name="play" v-if="song.play_count !== -1">{{
      song.play_count
    }}</DataCell>
    <DataCell class="play" column_name="play" v-else>---</DataCell>

    <ClearUpdateCell :song="song" />
    <RankUpdateCell :song="song" />
    <ScoreUpdateCell :song="song" :percentile="percentile" />
    <BpUpdateCell :song="song" />

    <DateCell column_name="date" :date="song.updated_at" />
  </div>
</template>
