<template>
  <modal-base id="filter-modal" ref="modal_base">
    <template v-slot:header>
      <h2>譜面フィルター設定</h2>
    </template>
    <template v-slot:body>
      <song-filter-controller/>
    </template>
  </modal-base>
</template>

<script>
import SongFilterController from "../selector/SongFilterController"
import ModalBase from './ModalBase'

export default {
  name: "FilterModal",
  components: {SongFilterController, ModalBase},
  methods: {
    show_modal() {
      this.$refs.modal_base.show_modal()
    }
  }
}
</script>

<style scoped></style>