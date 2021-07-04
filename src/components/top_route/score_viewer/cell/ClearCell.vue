<template>
  <div class="td clear" :class="class_name" v-if="filter.column_is_active('clear')"/>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import config from "../../../../const"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "ClearCell",
  props: {song: SongDetail, filter: SongFilter},
  computed: {
    class_name() {
      return 'table-' + config.LAMP_INDEX[this.song.clear_type]
    }
  }
}
</script>