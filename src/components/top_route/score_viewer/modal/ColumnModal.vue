<template>
  <modal-base id="column-modal" ref="modal_base">
    <template v-slot:header>
      <h2>表示カラム設定</h2>
    </template>
    <template v-slot:body>
      <detail-columns/>
    </template>
  </modal-base>
</template>

<script>
import DetailColumns from "../selector/DetailColumns"
import ModalBase from "./ModalBase"

export default {
  name: "ColumnModal",
  components: {ModalBase,
      DetailColumns
  },
  methods: {
    show_modal() {
      this.$refs.modal_base.show_modal()
    },
  },
}
</script>

<style scoped></style>