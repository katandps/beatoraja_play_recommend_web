<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">目標{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="filter sidebar-body">
        <button class="btn btn-primary" @click="model.filter.for_random()">ランダムセレクト</button>
        <button class="btn btn-success" @click="model.filter.for_score()">スコア更新</button>
        <button class="btn btn-success" @click="model.filter.for_bp()">BP更新</button>
        <button class="btn btn-success" @click="model.filter.for_aaa()">AAA</button>
        <button class="btn btn-success" @click="model.filter.for_aa()">AA</button>
        <button class="btn btn-success" @click="model.filter.for_easy()">Easy</button>
        <button class="btn btn-success" @click="model.filter.for_hard()">Hard</button>
        <button class="btn btn-success" @click="model.filter.for_ex_hard()">EXH</button>
        <button class="btn btn-success" @click="model.filter.for_full_combo()">FC</button>
      </div>
    </transition>
  </div>
</template>

<script>
import Model from "../../../../models/model";

export default {
  name: "FilterPreset",
  props: {
    model: {
      type: Model,
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