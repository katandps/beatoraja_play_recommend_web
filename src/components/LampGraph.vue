<template>
  <div id="lamp-graph">
    <h2 @click="visible">ClearLamp{{show ? "▼" : "▶"}}</h2>
    <transition>
      <table style="width:100%" v-show="show">
        <tr v-for="(level, key) in lamps" :key="key" style="width:100%">
          <td style="width:30px">{{ table.levels[key] }}</td>
          <td class="progress" style="width:100%;height:1.8em">
            <div
                v-for="clear_type in config().LAMP_TYPE" :key="clear_type"
                :class="'progress-bar bg-' + clear_type"
                role="progressbar"
                :style="'width: ' + level[clear_type] * 100 + '%;color:#000'"
            >
              {{ level[clear_type] }}
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
  name: "LampGraph",
  props: {
    table: {
      type: Object,
      required: true,
    },
    lamps: {
      type: Array,
      required: true,
    },
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
  },
}
</script>

<style scoped>

</style>