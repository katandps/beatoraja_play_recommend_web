<template>
  <div id="rank-graph">
    凡例
    <table style="width: 100%">
      <tr>
        <td class="progress" style="width: 100%; height: 1.8em">
          <div
            v-for="rank in config.RANK_TYPE"
            :key="rank"
            :class="'progress-bar bg-' + rank"
            role="progressbar"
            style="color: #000"
            :style="'width: ' + 100.0 / config.RANK_TYPE.length + '%'"
          >
            {{ rank }}
          </div>
        </td>
      </tr>
    </table>
    <hr />
    <table style="width: 100%">
      <tr v-for="(level, level_index) in level_list" :key="level_index">
        <td style="width: 30px">{{ level }}</td>
        <td class="progress" style="width: 100%; height: 1.8em">
          <div
            v-for="(rank, rank_index) in config.RANK_TYPE"
            :key="rank"
            :class="'progress-bar bg-' + rank"
            role="progressbar"
            :style="
              'width: ' +
              rank_list[level_index][rank_index].length * 100 +
              '%;color:#000'
            "
            v-on:click="
              show_modal(level + ' ' + rank, list(level_index, rank_index))
            "
          >
            {{ rank_list[level_index][rank_index].length }}
          </div>
        </td>
      </tr>
    </table>
    <graph-modal id="song-list-modal" ref="modal" />
  </div>
</template>

<script setup>
import config from "../../../const"
import GraphModal from "./modal/GraphModal"
</script>

<script>
import log from "loglevel"
import SongDetail from "../../../models/song_detail"

export default {
  name: "RankGraph",
  props: {
    filtered_score: { required: true },
    table_list: { required: true },
    level_list: { required: true }
  },
  methods: {
    /**
     * @param {string} title
     * @param {string[]} text
     */
    show_modal(title, text) {
      log.debug("open clicked")
      this.$refs.modal.show_modal(title, text)
    },
    list(level_index, rank_index) {
      return this.rank_list[level_index][rank_index]
        .sort(SongDetail.cmp_title)
        .map((s) => s.title)
    }
  },
  computed: {
    /**
     * @returns {SongDetail[][][]} SongDetail[level][rank][index]
     */
    rank_list() {
      return this.level_list.map((l) =>
        config.RANK_TYPE.map((r) =>
          this.filtered_score
            .filter((s) => s.clear_rank === r && s.level === l)
            .sort(SongDetail.cmp_title)
        )
      )
    }
  }
}
</script>

<style scoped>
.progress-bar {
  cursor: pointer;
}
</style>
