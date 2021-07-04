<template>
  <div class="td rate" :class="'bg-' + song.clear_rank" v-if="filter.column_is_active('rate')">{{ song.get('rate') }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "RateCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>