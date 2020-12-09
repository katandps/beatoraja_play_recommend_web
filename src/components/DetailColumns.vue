<template>
  <div id="DetailColumns">
    <h4 @click="filter_visible">表示カラム{{ show ? "▼" : "▶" }}</h4>
    <transition>
      <div v-show="show">
        <div v-for="column in config().DETAIL_COLUMNS" :key="column">
          <label>
            <input type="checkbox" :id="column" v-model="active_columns[column]">
            {{ config().DETAIL_COLUMN_NAME[column] }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../const.js';

export default {
  name: "DetailColumns",
  data: () => ({
    active_columns: {
      'clear': true,
      'level': true,
      'title': true,
      'rate': true,
      'score': true,
      'bp': true,
      'combo': true,
      'play': true,
      'date': true
    },
    show: true,
  }),
  methods: {
    config() {
      return config;
    },
    filter_visible() {
      this.show = !this.show;
    },
  },
  watch: {
    active_columns: {
      immediate: true,
      handler: function () {
        this.$emit('updateColumnSelect', this.active_columns)
      }
    }
  }
}
</script>

<style scoped></style>