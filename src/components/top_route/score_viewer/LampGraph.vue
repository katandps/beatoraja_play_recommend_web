<template>
  <div id="lamp-graph">
    <label class="col-sm-3 btn btn-secondary" @click="show_filter_modal">表示曲設定</label>
    <hr>
    凡例
    <table style="width:100%">
      <tr>
        <td class="progress" style="width:100%;height:1.8em">
          <div v-for="clear_type in config.LAMP_TYPE" :key="clear_type"
               :class="'progress-bar bg-' + clear_type"
               role="progressbar"
               style="color:#000000"
               :style="'width: ' + 100.0/config.LAMP_TYPE.length + '%'"
          >{{ clear_type }}
          </div>
        </td>
      </tr>
    </table>
    <hr>
    <table style="width:100%">
      <tr v-for="(level, level_index) in level_list" :key="level_index"
          style="width:100%">
        <td style="width:30px">{{ level }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="(lamp_index) in config.LAMP_GRAPH_LIST"
              :key="config.LAMP_INDEX[lamp_index]"
              :class="'progress-bar bg-' + config.LAMP_INDEX[lamp_index]"
              role="progressbar"
              :style="'width: ' + lamp_list[level_index][lamp_index].length * 100 + '%;color:#000'"
              v-on:click="show_modal(
                  level + ' ' +  config.LAMP_INDEX[lamp_index],
                   list(level_index, lamp_index)
                   )"
          >
            {{ lamp_list[level_index][lamp_index].length }}
          </div>
        </td>
      </tr>
    </table>
    <graph-modal id="song-list-modal" ref="modal" />
    <filter-modal id="filter-modal" ref="filter_modal"/>
  </div>
</template>

<script setup>
import config from "../../../const.js"
</script>

<script>
import * as log from "loglevel"
import SongDetail from "../../../models/song_detail"
import GraphModal from "./modal/GraphModal"
import FilterModal from "./modal/FilterModal"

export default {
  name: "LampGraph",
  components: {GraphModal, FilterModal},
  props: {
    filtered_score: { required: true },
    table_list: { required: true },
    level_list: { required: true },
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
      return this.lamp_list[level_index][rank_index].sort(SongDetail.cmp_title).map(s => s.title)
    },
    show_filter_modal() {
      this.$refs.filter_modal.show_modal()
    },
  },
  computed: {
    /**
     * @returns {SongDetail[][][]} SongDetail[level][rank][index]
     */
    lamp_list() {
      return this.level_list.map(
          level => config.LAMP_INDEX.map(
              (_lamp, index) => this.filtered_score.filter(s => s.clear_type === index && s.level === level).sort(SongDetail.cmp_title)
          )
      )
    },
  }
}
</script>

<style scoped>
.progress-bar {
  cursor: pointer;
}
</style>