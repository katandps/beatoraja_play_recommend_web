<template>
  <modal-base id="recommend-modal" ref="modal_base">
    <template v-slot:header>
       <h2>おすすめ設定</h2>
    </template>
    <template v-slot:body>
      <filter-preset/>
    </template>
  </modal-base>
</template>

<script>
import FilterPreset from "../selector/FilterPreset"
import ModalBase from "./ModalBase"

export default {
  name: "RecommendModal",
  components: {ModalBase, FilterPreset},
  methods: {
    show_modal() {
      this.$refs.modal_base.show_modal()
    },
  },
}
</script>

<style scoped></style>