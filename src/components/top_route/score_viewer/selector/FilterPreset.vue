<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">目標{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="filter sidebar-body">
        <button class="btn btn-primary" @click="filter.for_random()">ランダムセレクト</button>
        <button class="btn btn-success" @click="filter.for_score()">スコア更新</button>
        <button class="btn btn-success" @click="filter.for_bp()">BP更新</button>
        <button class="btn btn-success" @click="filter.for_aaa()">AAA</button>
        <button class="btn btn-success" @click="filter.for_aa()">AA</button>
        <button class="btn btn-success" @click="filter.for_easy()">Easy</button>
        <button class="btn btn-success" @click="filter.for_hard()">Hard</button>
        <button class="btn btn-success" @click="filter.for_ex_hard()">EXH</button>
        <button class="btn btn-success" @click="filter.for_full_combo()">FC</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "FilterPreset",
  data: () => ({
    show: true,

  }),
  methods: {
    filter_visible() {
      this.show = !this.show;
    },
  },
  computed: {
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>

<style scoped>
.filter button {
  margin: 5px;
  display: inline
}
</style>