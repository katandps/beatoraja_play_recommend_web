<template>
  <div id="lamp-graph">
    <TableSelector :model="model" :filter="filter" @setTable="set_table" v-if="model.tables_is_set()"/>
    <hr>
    凡例
    <table style="width:100%">
      <tr>
        <td class="progress" style="width:100%;height:1.8em">
          <div v-for="clear_type in config().LAMP_TYPE" :key="clear_type"
               :class="'progress-bar bg-' + clear_type"
               role="progressbar"
               style="color:#000000"
               :style="'width: ' + 100.0/config().LAMP_TYPE.length + '%'"
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
              v-for="(lamp_index) in config().LAMP_GRAPH_LIST"
              :key="config().LAMP_INDEX[lamp_index]"
              :class="'progress-bar bg-' + config().LAMP_INDEX[lamp_index]"
              role="progressbar"
              :style="'width: ' + lamp_list[level_index][lamp_index].length * 100 + '%;color:#000'"
              v-on:click="show_modal(
                  level + ' ' +  config().LAMP_INDEX[lamp_index],
                   list(level_index, lamp_index)
                   )"
          >
            {{ lamp_list[level_index][lamp_index].length }}
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
  name: "LampGraph",
  components: {TableSelector, GraphModal},
  props: {
    model: {
      type: Model,
      required: true,
    },
    filter: {
      type: SongFilter,
      required: true,
    },
    header_visible: {
      type: Boolean
    }
  },
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
      return this.lamp_list[level_index][rank_index].sort(SongDetail.cmp_title).map(s => s.title)
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
     * @returns {SongDetail[][][]}
     */
    lamp_list() {
      return this.model.get_lamp_list(this.filter)
    },
    level_list() {
      return this.model.get_selected_table().level_list
    },
  }
}
</script>

<style scoped>
.progress-bar {
  cursor: pointer;
}
</style>