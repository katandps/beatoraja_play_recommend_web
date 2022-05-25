<script setup lang="ts">
import { ref } from "vue"
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
export interface IGraphModal {
  showModal: (title: string, text: string[]) => void
}

// --- ref ---
const modal_base = ref<IModalBase>()

// --- data ---
const title = ref("")
const text = ref<string[]>([])

// --- methods ---
const showModal = (ti: string, tx: string[]) => {
  title.value = ti
  text.value = tx
  modal_base.value?.showModal()
}

// --- expose ---
defineExpose({ showModal })
</script>

<template>
  <ModalBaseVue id="graph-modal" ref="modal_base">
    <template v-slot:header>
      <h2>{{ title }}</h2>
    </template>
    <template v-slot:body>
      <ul>
        <li v-for="(tx, index) in text" :key="index">{{ tx }}</li>
      </ul>
    </template>
  </ModalBaseVue>
</template>
