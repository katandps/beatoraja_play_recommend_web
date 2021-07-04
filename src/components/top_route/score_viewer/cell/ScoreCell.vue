<template>
  <div class="td score" v-if="filter.column_is_active('score')">{{ `${song.score}/${song.total_notes * 2}` }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "ScoreCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>