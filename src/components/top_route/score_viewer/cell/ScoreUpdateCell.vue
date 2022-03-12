<template>
  <data-cell class="update" column_name="score_update">
    <span v-if="percentile">
      <span v-if="is_updated">
        <span class="update_strong">+{{ percent_diff }}</span> ({{ song.score_rate_format(song.score) }})%
      </span>
      <span v-else>{{ song.score_rate_format(song.score) }}%</span>
    </span>
    <span v-else>
      <span v-if="is_updated">
        <span class="update_strong">+{{ score_diff }}</span> ({{ song.score }})
      </span>
      <span v-else>{{ song.score }}</span>
    </span>
  </data-cell>
</template>

<script>
import DataCell from "@/components/top_route/score_viewer/cell/DataCell"
import SongDetail from "@/models/song_detail"
import config from "../../../../const"

export default {
  name: "ScoreUpdateCell",
  components: {DataCell},
  props: {
    song: {
      type: SongDetail,
      require: true
    },
    percentile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    config() {
      return config
    },
    is_updated() {
      return this.song.score_updated_at.split('T')[0] === this.song.updated_at.split('T')[0]
    },
    score_diff() {
      return this.song.score - this.song.score_before
    },
    percent_diff() {
      return this.song.score_rate_format(this.score_diff)
    }
  },
}
</script>