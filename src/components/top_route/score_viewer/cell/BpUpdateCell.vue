<template>
  <data-cell class="update" column_name="bp_update">
    <span v-if="song.min_bp_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
      <span class="update_strong" v-if="song.min_bp_before !== -1">{{
          song.min_bp - song.min_bp_before
        }}</span>
      <span class="update_strong" v-else>new</span>
      ({{ song.min_bp }})
    </span>
    <span v-else>{{ song.min_bp }}</span>
  </data-cell>
</template>

<script>
import DataCell from "@/components/top_route/score_viewer/cell/DataCell"
import SongDetail from "@/models/song_detail"
import config from "../../../../const"

export default {
  name: "BpUpdateCell",
  components: {DataCell},
  props: {
    song: {
      type: SongDetail,
      require: true
    }
  },
  computed: {
    config() {
      return config
    }
  }
}
</script>