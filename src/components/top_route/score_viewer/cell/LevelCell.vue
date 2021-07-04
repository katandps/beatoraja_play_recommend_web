<template>
  <div class="td level" v-if="filter.column_is_active('level')">{{ song.level }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "LevelCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>