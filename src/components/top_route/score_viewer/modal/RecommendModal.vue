<template>
  <modal-base id="recommend-modal" ref="modal_base">
    <template v-slot:header>
       <h2>おすすめ設定</h2>
    </template>
    <template v-slot:body>
      <div class="filter">
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
    </template>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase"

export default {
  name: "RecommendModal",
  components: {ModalBase},
  methods: {
    show_modal() {
      this.$refs.modal_base.show_modal()
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