<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">表示カラム{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <div v-for="column in config().DETAIL_COLUMNS" :key="column">
          <label>
            <input type="checkbox" :id="column" v-model="filter.columns[column]">
            {{ config().DETAIL_COLUMN_NAME[column] }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../../const.js';
import Filter from "../../models/filter";

export default {
  name: "DetailColumns",
  props: {
    filter: {
      type: Filter,
      required: true,
    }
  },
  data: () => ({
    show: false,
  }),
  methods: {
    config() {
      return config;
    },
    filter_visible() {
      this.show = !this.show;
    },
  },
}
</script>

<style scoped></style>