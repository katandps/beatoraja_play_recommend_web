<script setup lang="ts">
import SongDetail, { score_format } from "../../../../models/song_detail"
import DataCell from "./DataCell.vue"
import config from "../../../../const"
import { computed } from "vue"
import Columns from "../../../../models/columns"

// --- props ---
interface Props {
  song: SongDetail
  percentile: boolean
  columns: Columns
}
const props = defineProps<Props>()

// --- emits ---
const emits = defineEmits(["showModal"])

// --- computed ---
const clear_class = computed(
  () => "table-line-" + config.LAMP_INDEX[props.song.clear_type]
)
const clear_bg_class = computed(
  () => "bg-" + config.LAMP_INDEX[props.song.clear_type]
)
const clear_before_bg_class = computed(
  () => "bg-" + config.LAMP_INDEX[props.song.clear_type_before]
)
const clear_rival_bg_class = computed(
  () => "bg-" + config.LAMP_INDEX[props.song.rival_clear_type]
)
const clear_rank_bg_class = computed(() => "bg-" + props.song.clear_rank)

const level = computed(() => props.song.level)
const title = computed(() => props.song.title)

const bp = computed(() => (props.song.min_bp === -1 ? "-" : props.song.min_bp))

const update_day = computed(() => props.song.updated_at.split("T")[0])
const clear_update_day = computed(
  () => props.song.clear_updated_at.split("T")[0]
)
const score_update_day = computed(
  () => props.song.score_updated_at.split("T")[0]
)
const bp_update_day = computed(() => props.song.min_bp_updated_at.split("T")[0])
const play_count = computed(() =>
  props.song.play_count <= 0 ? "-" : props.song.play_count
)
const current_rank = computed(() =>
  SongDetail.make_clear_rank(props.song.total_notes, props.song.score)
)
const current_detail_rank = computed(() =>
  SongDetail.make_detail_rank(props.song.total_notes, props.song.score)
)
const next_rank = computed(() => props.song.get("next_rank"))
const score_for_next_rank = computed(() => props.song.get("next_rank_score"))

// rivals
const clear_vs = computed(() =>
  props.song.clear_type === props.song.rival_clear_type
    ? "draw"
    : props.song.clear_type < props.song.rival_clear_type
      ? "lose"
      : "win"
)
const score_vs = computed(() =>
  props.song.score === 0 || props.song.rival_score === 0
    ? "-"
    : props.song.score - props.song.rival_score
)
const score_vs_class = computed(() =>
  score_vs.value === 0 ? "draw" : score_vs.value < 0 ? "lose" : "win"
)
const bp_vs = computed(() =>
  props.song.min_bp === -1 ||
    props.song.min_bp === 2147483647 ||
    props.song.rival_min_bp === -1 ||
    props.song.rival_min_bp === 2147483647
    ? "-"
    : props.song.min_bp - props.song.rival_min_bp
)
const bp_vs_class = computed(() =>
  bp_vs.value === 0 ? "draw" : bp_vs.value < 0 ? "win" : "lose"
)
const rival_date = computed(() => dayFormat(props.song.rival_updated_at))

// updates
const score_diff = computed(() => props.song.score - props.song.score_before)
const percent_diff = computed(() => score_format(props.song.total_notes, score_diff.value))
const rank_is_update = computed(
  () =>
    rank_before.value !== current_rank.value &&
    update_day.value === score_update_day.value
)
const score_is_update = computed(
  () =>
    props.song.score_before !== props.song.score &&
    update_day.value === score_update_day.value
)
const rank_before = computed(() =>
  SongDetail.make_clear_rank(props.song.total_notes, props.song.score_before)
)

// --- method ---
const showModal = () => emits("showModal", props.song)
const dayFormat = (date: string) => {
  let day = date.split("T")[0]
  return day === "1970-01-01" ? "-" : day
}
</script>

<template>
  <div class="tr" :class="clear_class">
    <DataCell class="clear" :columns="columns" name="clear" :class="clear_bg_class" />
    <DataCell class="date" :columns="columns" name="clear_date">
      {{ clear_update_day }}
    </DataCell>
    <DataCell class="clear" :columns="columns" name="clear_before" :class="clear_before_bg_class" />

    <DataCell class="level" :columns="columns" name="level">
      {{ level }}
    </DataCell>
    <DataCell class="title" :columns="columns" name="title" @click="showModal()">
      {{ title }}
    </DataCell>

    <DataCell class="update" :columns="columns" name="clear_update">
      <span v-if="song.clear_type > 0 && clear_update_day === update_day">
        <font-awesome-icon :icon="['fas', 'square']" :class="'color-' + config.LAMP_INDEX[song.clear_type_before]"
          v-tooltip="config.LAMP_INDEX[song.clear_type_before]" />
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" style="margin-inline: 0.2em" />
        <font-awesome-icon :icon="['fas', 'square']" :class="'color-' + config.LAMP_INDEX[song.clear_type]"
          v-tooltip="config.LAMP_INDEX[song.clear_type]" />
      </span>
      <span v-else>
        <font-awesome-icon :icon="['fas', 'square']" :class="'color-' + config.LAMP_INDEX[song.clear_type]"
          v-tooltip="config.LAMP_INDEX[song.clear_type]" />
      </span>
    </DataCell>

    <DataCell class="rank" :columns="columns" name="score_rank" v-tooltip="next_rank + '-' + score_for_next_rank">
      {{ current_rank }}
    </DataCell>
    <DataCell class="rank" :columns="columns" name="detail_rank" v-tooltip=""> {{ current_detail_rank }} </DataCell>
    <DataCell class="update" :columns="columns" name="rank_update" v-tooltip="next_rank + '-' + score_for_next_rank">
      <span v-if="rank_is_update">
        {{ rank_before }}
        <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" style="margin-right: 0.2em" />
        <span class="update_strong">{{ current_rank }}</span>
      </span>
      <span v-else>{{ current_rank }}</span>
    </DataCell>

    <DataCell class="rate" :columns="columns" name="rate" :class="clear_rank_bg_class">
      {{ score_format(song.total_notes, song.score) }}
    </DataCell>
    <DataCell class="score" :columns="columns" name="score">
      {{ `${song.score}/${song.total_notes * 2}` }}
    </DataCell>
    <DataCell class="date" :columns="columns" name="score_date"> {{ score_update_day }} </DataCell>

    <DataCell class="score" :columns="columns" name="score_before"> {{ song.score_before }} </DataCell>
    <DataCell class="update" :columns="columns" name="score_update">
      <span v-if="percentile">
        <span v-if="score_is_update">
          <span class="update_strong">+{{ percent_diff }}</span>
          ({{ score_format(song.total_notes, song.score) }})%
        </span>
        <span v-else>{{ score_format(song.total_notes, song.score) }}%</span>
      </span>
      <span v-else>
        <span v-if="score_is_update">
          <span class="update_strong">+{{ score_diff }}</span>
          ({{ song.score }})
        </span>
        <span v-else>{{ song.score }}</span>
      </span>
    </DataCell>

    <DataCell class="bp" :columns="columns" name="bp">
      {{ song.min_bp === -1 || song.min_bp === 2147483647 ? "---" : song.min_bp }}
    </DataCell>
    <DataCell class="date" :columns="columns" name="bp_date">{{ bp_update_day }}</DataCell>
    <DataCell class="bp" :columns="columns" name="bp_before">
      {{ song.min_bp_before === -1 ? "---" : song.min_bp_before }}
    </DataCell>
    <DataCell class="update" :columns="columns" name="bp_update">
      <span v-if="bp !== '-' && bp_update_day === update_day">
        <span class="update_strong" v-if="song.min_bp_before !== -1">
          {{ song.min_bp - song.min_bp_before }}
        </span>
        <span class="update_strong" v-else>new</span>
        ({{ bp }})
      </span>
      <span v-else>{{ bp }}</span>
    </DataCell>

    <DataCell class="combo" :columns="columns" name="combo"> {{ song.max_combo }} </DataCell>

    <DataCell class="play" :columns="columns" name="play"> {{ play_count }}</DataCell>
    <DataCell class="date" :columns="columns" name="date"> {{ update_day }}</DataCell>

    <DataCell class="clear_vs" :columns="columns" name="clear_diff_rival" :class="clear_rival_bg_class">
      <span :class="clear_vs">{{ clear_vs }}</span>
    </DataCell>
    <DataCell class="score_vs" :columns="columns" name="score_diff_rival">
      <span :class="score_vs_class">{{ score_vs }}</span>
    </DataCell>
    <DataCell class="bp_vs" :columns="columns" name="bp_diff_rival">
      <span :class="bp_vs_class">{{ bp_vs }}</span>
    </DataCell>
    <DataCell name="rival_date" class="date" :columns="columns">
      {{ rival_date }}
    </DataCell>
  </div>
</template>
