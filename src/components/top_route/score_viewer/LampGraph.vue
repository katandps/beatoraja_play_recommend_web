<template>
  <div id="lamp-graph">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()"/>
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
    <div id="song-list-modal" @click="close_modal">
      <modal name="modal-area" :scrollable="true" :maxWidth="920" height="auto">
        <div class="modal-header">
          {{ modal_title }}
        </div>
        <div class="modal-body">
          <ul>
            <li v-for="(text, index) in modal_text" :key="index">{{ text }}</li>
          </ul>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import config from "../../../const.js"
import Model from "../../../models/model";
import * as log from "loglevel";
import SongDetail from "../../../models/song_detail";
import TableSelector from "./TableSelector";

export default {
  name: "LampGraph",
  components: {TableSelector},
  props: {
    model: {
      type: Model,
      required: true,
    },
    header_visible: {
      type: Boolean
    }
  },
  data: () => ({
    modal_title: "",
    modal_text: "",
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
      this.modal_text = text;
      this.modal_title = title;
      this.$modal.show("modal-area")
    },
    close_modal() {
      this.$modal.hide("modal-area")
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
      return this.model.get_lamp_list()
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

.modal-body {
  padding: 5px 25px;
  font-size: 0.9rem;
}

.modal-body li {
  text-align: left;
}

.modal-header {
  padding: 5px 25px;
  font-size: 1.4rem;
  border-bottom: 1px solid #ddd;
}
</style>