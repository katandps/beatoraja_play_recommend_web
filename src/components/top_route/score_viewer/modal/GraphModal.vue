<template>
  <modal-base id="graph-modal" ref="modal_base">
    <template v-slot:header>
      <h2>{{title}}</h2>
    </template>
    <template v-slot:body>
      <ul>
        <li v-for="(text, index) in text" :key="index">{{ text }}</li>
      </ul>
    </template>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase"
export default {
  name: "GraphModal",
  components: {ModalBase},
  data: () => ({
    text: "",
    title: ""
  }),
  methods: {
    show_modal(title, text) {
      this.text = text
      this.title = title
      this.$refs.modal_base.show_modal()
    },
  },
}
</script>

<style scoped></style>