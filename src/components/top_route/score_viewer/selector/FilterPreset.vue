<template>
  <div id="DetailColumns">
    <div class="filter sidebar-body">
      <h3>更新狙い</h3>
      <button class="btn btn-success" @click="filter.for_score()">スコア更新狙い</button>
      <button class="btn btn-success" @click="filter.for_bp()">BP更新狙い</button>
      <h3>スコアランク狙い</h3>
      <button class="btn btn-success" @click="filter.for_aaa()">AAA狙い</button>
      <button class="btn btn-success" @click="filter.for_aa()">AA狙い</button>
      <h3>クリアランプ狙い</h3>
      <button class="btn btn-success" @click="filter.for_easy()">Easy狙い</button>
      <button class="btn btn-success" @click="filter.for_hard()">Hard狙い</button>
      <button class="btn btn-success" @click="filter.for_ex_hard()">EXH狙い</button>
      <button class="btn btn-success" @click="filter.for_full_combo()">FC狙い</button>
      <h3>ランダムセレクト</h3>
      <button class="btn btn-primary" @click="filter.for_random()">ランダムセレクト</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterPreset",
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