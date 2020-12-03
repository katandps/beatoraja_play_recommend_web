<template>
  <div id="rank-graph">
    <h2 @click="visible">ScoreRank{{ show ? "▼" : "▶" }}</h2>
    <transition>
      <table style="width:100%" v-show="show">
        <tr v-for="(level, key) in ranks" :key="key" style="width:100%">
          <td style="width:30px">{{ table.levels[key] }}</td>
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
    </transition>
  </div>
</template>

<script>
import config from "../const.js"

export default {
  name: "RankGraph",
  props: {
    ranks: {
      type: Array,
      required: true
    },
    table: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false,
  }),
  methods: {
    config() {
      return config;
    },
    visible() {
      this.show = !this.show;
    }
  }
}
</script>

<style scoped>

</style>