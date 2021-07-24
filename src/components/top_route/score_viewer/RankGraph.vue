<template>
  <div id="rank-graph">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()"/>
    <hr>
    凡例
    <table style="width:100%">
      <tr>
        <td class="progress" style="width:100%;height:1.8em">
          <div v-for="rank in config().RANK_TYPE" :key="rank"
               :class="'progress-bar bg-' + rank"
               role="progressbar"
               style="color:#000"
               :style="'width: ' + 100.0/config().RANK_TYPE.length + '%'"
          >{{ rank }}
          </div>
        </td>
      </tr>
    </table>
    <hr>
    <table style="width:100%">
      <tr v-for="(level, level_index) in level_list" :key="level_index">
        <td style="width:30px">{{ level }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="(rank, rank_index) in config().RANK_TYPE" :key="rank"
              :class="'progress-bar bg-' + rank"
              role="progressbar"
              :style="'width: ' + rank_list[level_index][rank_index].length * 100 + '%;color:#000'"
              v-on:click="show_modal(
                  level + ' ' +  rank,
                  list(level_index, rank_index)
              )"
          >
            {{ rank_list[level_index][rank_index].length }}
          </div>
        </td>
      </tr>
    </table>
    <graph-modal id="song-list-modal" ref="modal" />
  </div>
</template>

<script>
import config from "../../../const.js"
import Model from "../../../models/model"
import * as log from "loglevel"
import SongDetail from "../../../models/song_detail"
import TableSelector from "./selector/TableSelector"
import GraphModal from "./modal/GraphModal"
import SongFilter from "../../../models/songFilter"

export default {
  name: "RankGraph",
  components: {
    TableSelector,
    GraphModal
  },
  props: {
    model: {
      type: Model,
      required: true,
    },
  },
  data: () => ({
    modal_title: "",
    modal_text: "",
    filter: new SongFilter()
  }),
  methods: {
    config() {
      return config;
    },
    /**
     * @param {string} title
     * @param {string[]} text
     */
    show_modal(title, text) {
      log.debug("open clicked")
      this.$refs.modal.show_modal(title, text)
    },
    list(level_index, rank_index) {
      return this.rank_list[level_index][rank_index].sort(SongDetail.cmp_title).map(s => s.title)
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
  },
  computed: {
    /**
     * @returns {SongDetail[][][]} SongDetail[level][rank][index]
     */
    rank_list() {
      if (!this.model.is_initialized()) {
        return []
      }
      let songs = this.model.filtered_score(this.$store.state.filter)
      return this.level_list.map(
          l => config.RANK_TYPE.map(
              r => songs.filter(s => s.clear_rank === r && s.level === l).sort(SongDetail.cmp_title)
          )
      )
    },
    level_list() {
      return this.model.level_list()
    }
  }
}
</script>

<style scoped>
.progress-bar {
  cursor: pointer;
}
</style>