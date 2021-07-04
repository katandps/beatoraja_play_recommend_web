<template>
  <div class="td bp" v-if="filter.column_is_active('bp')">{{ song.min_bp }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "MinBpCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>