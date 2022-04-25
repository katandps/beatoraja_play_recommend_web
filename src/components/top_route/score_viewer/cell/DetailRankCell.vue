<template>
  <data-cell class="rank" column_name="score_rank"
      v-tooltip="song.get('next_detail_rank') + '-' + song.get('next_detail_rank_score')">
    {{song.get('detail_rank')}}
  </data-cell>
</template>

<script>
import DataCell from "@/components/top_route/score_viewer/cell/DataCell"
import SongDetail from "@/models/song_detail"

export default {
  name: "RankUpdateCell",
  components: {DataCell},
  props: {
    song: {
      type: SongDetail,
      require: true
    }
  },
}
</script>