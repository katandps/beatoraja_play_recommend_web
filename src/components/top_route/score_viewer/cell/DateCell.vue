<template>
  <div class="td date" v-if="filter.column_is_active('date')">{{ song.updated_at.split("T")[0] }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "DateCell",
  props: {song: SongDetail, filter: SongFilter}
}
</script>