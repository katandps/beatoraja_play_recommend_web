<template>
  <div class="td combo" v-if="filter.column_is_active('combo')">{{ song.max_combo }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "ComboCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>