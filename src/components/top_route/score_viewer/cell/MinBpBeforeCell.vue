<template>
  <div class="td bp" v-if="filter.column_is_active('bp_before')">{{ song.min_bp_before }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "MinBpBeforeCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>