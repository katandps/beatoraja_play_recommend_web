<template>
  <div class="td score" v-if="filter.column_is_active('score_before')">{{ song.score_before }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "ScoreBeforeCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>