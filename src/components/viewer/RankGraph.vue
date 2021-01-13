<template>
  <div id="rank-graph">
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
      <tr v-for="(level, key) in level_list" :key="key">
        <td style="width:30px">{{ level }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="rank in config().RANK_TYPE" :key="rank"
              :class="'progress-bar bg-' + rank"
              role="progressbar"
              :style="'width: ' + get_list(level, rank).length * 100 + '%;color:#000'"
              v-on:click="show_modal(level + ' ' +  rank, get_list(level, rank).map(s => s.title))"
          >
            {{ get_list(level, rank).length }}
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
import Model from "../../models/model"
import * as log from "loglevel"

export default {
  name: "RankGraph",
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
    get_list(level, rank_type) {
      return this.model.get_rank_list(level, rank_type)
    },
    /**
     *
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