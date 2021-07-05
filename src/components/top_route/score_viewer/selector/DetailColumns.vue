<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">
      表示カラム{{ show ? "▼" : "▶" }}
    </h6>
    <transition>
      <div v-show="show" class="form-group row align-items-center">
        <div v-for="obj in column_list" :key="obj.key"
             class="form-control col-sm-3 text-nowrap">
          <label style="font-size:0.9rem">
            <input type="checkbox" :id="obj.key"
                   v-model="filter.columns[obj.key]">
            {{ obj.name }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../../../../const.js'
import SongFilter from "../../../../models/songFilter"

export default {
  name: "DetailColumns",
  props: {
    filter: SongFilter
  },
  data: () => ({
    show: false,
  }),
  computed: {
    column_list() {
      return config.DETAIL_COLUMNS.filter(c => c.key !== "title")
    },
  },
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