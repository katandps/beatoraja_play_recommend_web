<template>
  <div id="rank-graph">
    <table style="width:100%">
      <tr v-for="(level, key) in model.get_current_ranks()" :key="key"
          style="width:100%">
        <td style="width:30px">{{ model.get_selected_table().levels[key] }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="rank in config().RANK_TYPE" :key="rank"
              :class="'progress-bar bg-' + rank"
              role="progressbar"
              :style="'width: ' + level[rank] * 100 + '%;color:#000'"
          >
            {{ level[rank] }}
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
  }
}
</script>

<style scoped>

</style>