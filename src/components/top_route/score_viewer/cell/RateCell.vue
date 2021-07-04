<template>
  <div class="td rate" :class="'bg-' + song.clear_rank" v-if="filter.column_is_active('rate')">{{ song.score_rate_format(song.score) }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "RateCell",
  props: {song: SongDetail, filter: SongFilter},
}
</script>