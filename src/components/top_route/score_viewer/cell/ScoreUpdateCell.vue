<template>
  <data-cell class="update" column_name="score_update">
    <span v-if="song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
      <span class="update_strong">+{{ song.score - song.score_before }}</span> ({{ song.score }})
    </span>
    <span v-else>{{ song.score }}</span>
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
    }
  },
  computed: {
    config() {
      return config
    }
  }
}
</script>