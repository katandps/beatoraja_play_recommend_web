<template>
  <div id="DetailColumns">
    <h4 @click="filter_visible">リコメンド{{ show ? "▼" : "▶" }}</h4>
    <transition>
      <div v-show="show" class="filter">
        <button class="btn btn-success" @click="filter.for_score()">スコア狙い</button>
        <button class="btn btn-success" @click="filter.for_bp()">BP狙い</button>
        <button class="btn btn-success" @click="filter.for_aaa()">AAA狙い</button>
        <button class="btn btn-success" @click="filter.for_aa()">AA狙い</button>
        <button class="btn btn-success" @click="filter.for_easy()">Easy狙い</button>
        <button class="btn btn-success" @click="filter.for_hard()">Hard狙い</button>
        <button class="btn btn-success" @click="filter.for_ex_hard()">EXH狙い</button>
        <button class="btn btn-success" @click="filter.for_full_combo()">FC狙い</button>
      </div>
    </transition>
  </div>
</template>

<script>
import Filter from "../../models/filter";

export default {
  name: "FilterPreset",
  props: {
    filter: {
      type: Filter,
      required: true,
    }
  },
  data: () => ({
    show: true,

  }),
  methods: {
    filter_visible() {
      this.show = !this.show;
    },
  }
}
</script>

<style scoped>
.filter button {
  margin: 5px;
  display: inline
}
</style>