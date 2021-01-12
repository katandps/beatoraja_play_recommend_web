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
          >
            {{ get_list(level, rank).length }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import config from "../../const.js"
import Model from "../../models/model";

export default {
  name: "RankGraph",
  props: {
    model: {
      type: Model,
      required: true,
    },
  },
  methods: {
    config() {
      return config;
    },
    get_list(level, rank_type) {
      return this.model.get_rank_list(level, rank_type)
    }
  },
  computed: {
    level_list() {
      return this.model.get_selected_table().level_list
    }
  }
}
</script>

<style scoped>

</style>