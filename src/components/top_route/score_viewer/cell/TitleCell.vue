<template >
  <div class="td title" @click="click" v-if="filter.column_is_active('title')">{{ song.title }}</div>
</template>

<script>
import SongDetail from "../../../../models/song_detail"
import SongFilter from "../../../../models/songFilter"

export default {
  name: "TitleCell",
  props: {song: SongDetail, filter: SongFilter},
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>