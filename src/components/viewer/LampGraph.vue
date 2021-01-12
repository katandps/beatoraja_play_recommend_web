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
      <tr v-for="(level, key) in level_list" :key="key"
          style="width:100%">
        <td style="width:30px">{{ level }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="clear_type in config().LAMP_TYPE" :key="clear_type"
              :class="'progress-bar bg-' + clear_type"
              role="progressbar"
              :style="'width: ' + get_list(level, clear_type).length * 100 + '%;color:#000'"
          >
            {{ get_list(level, clear_type).length }}
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
  name: "LampGraph",
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
    get_list(level, lamp_type) {
      return this.model.get_lamp_list(level, lamp_type)
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