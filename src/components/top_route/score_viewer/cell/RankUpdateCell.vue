<template>
  <data-cell class="update" column_name="rank_update">
    <span
        v-if="rank_a(song) !== rank_b(song)&& song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
      {{ rank_a(song) }}
      <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" style="margin-right:0.2em"/>
      <span class="update_strong">{{ rank_b(song) }}</span>
    </span>
    <span v-else>-</span>
  </data-cell>
</template>

<script>
import DataCell from "@/components/top_route/score_viewer/cell/DataCell"
import SongDetail from "@/models/song_detail"
import config from "../../../../const"

export default {
  name: "RankUpdateCell",
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
  },
  methods: {
    rank_a(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score_before)
    },
    rank_b(song) {
      return SongDetail.make_clear_rank(song.total_notes, song.score)
    },
  }
}
</script>