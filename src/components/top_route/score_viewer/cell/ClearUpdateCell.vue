<template>
  <data-cell class="update" column_name="clear_update">
    <span
        v-if="song.clear_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
      <font-awesome-icon :icon="['fas', 'square']"
                         :class="'color-' + config.LAMP_INDEX[song.clear_type_before]"
                          v-tooltip="config.LAMP_INDEX[song.clear_type_before]"/>
      <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']"
                         style="margin-inline:0.2em"/>
      <font-awesome-icon :icon="['fas', 'square']"
                         :class="'color-' + config.LAMP_INDEX[song.clear_type]"
                         v-tooltip="config.LAMP_INDEX[song.clear_type]"/>
    </span>
    <span v-else>-</span>
  </data-cell>
</template>

<script>
import DataCell from "@/components/top_route/score_viewer/cell/DataCell"
import SongDetail from "@/models/song_detail"
import config from "../../../../const"

export default {
  name: "ClearUpdateCell",
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