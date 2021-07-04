<template>
  <div class="td play" v-if="filter.column_is_active('play')">{{ song.play_count }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "PlayCountCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>