<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">
      表示カラム{{ show ? "▼" : "▶" }}
    </h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <div v-for="obj in config().DETAIL_COLUMNS" :key="obj.key">
          <label>
            <input type="checkbox" :id="obj.key"
                   v-model="model.filter.columns[obj.key]">
            {{ obj.name }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../../const.js';
import Model from "../../models/model";

export default {
  name: "DetailColumns",
  props: {
    model: {
      type: Model,
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