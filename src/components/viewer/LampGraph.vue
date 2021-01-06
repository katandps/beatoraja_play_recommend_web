<template>
  <div id="lamp-graph">
    <h2 @click="visible">ClearLamp{{show ? "▼" : "▶"}}</h2>
    <transition>
      <table style="width:100%" v-show="show">
        <tr v-for="(level, key) in model.get_current_lamps()" :key="key" style="width:100%">
          <td style="width:30px">{{ model.selected_table.levels[key] }}</td>
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
import config from "../../const.js"
import Model from "../../models/model";

export default {
  name: "LampGraph",
  props: {
    model: {
      type: Model,
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