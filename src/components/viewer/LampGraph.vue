<template>
  <div id="lamp-graph">
    凡例
    <table style="width:100%">
      <tr>
        <td class="progress" style="width:100%;height:1.8em">
          <div v-for="clear_type in config().LAMP_TYPE" :key="clear_type"
               :class="'progress-bar bg-' + clear_type"
               role="progressbar"
               style="color:#000"
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
              v-for="(clear_type,lamp_index) in config().LAMP_TYPE"
              :key="clear_type"
              :class="'progress-bar bg-' + clear_type"
              role="progressbar"
              :style="'width: ' + lamp_list[level_index][lamp_index].length * 100 + '%;color:#000'"
              v-on:click="show_modal(level + ' ' +  clear_type, lamp_list[level_index][lamp_index].map(s => s.title))"
          >
            {{ lamp_list[level_index][lamp_index].length }}
          </div>
        </td>
      </tr>
    </table>
    <div id="song-list-modal">
      <modal name="modal-area" :draggable="true" :scrollable="true"
             width="80%" height="auto" :reset="true">
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
import config from "../../const.js"
import Model from "../../models/model";
import * as log from "loglevel";

export default {
  name: "LampGraph",
  props: {
    model: {
      type: Model,
      required: true,
    },
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
    }
  }
}
</script>

<style scoped>
.progress-bar {
  cursor: pointer;
}

.modal-header, .modal-body {
  padding: 5px 25px;
  font-size: 0.9rem;
}

.modal-body li {
  list-style: none;
}

.modal-header {
  border-bottom: 1px solid #ddd;
}
</style>