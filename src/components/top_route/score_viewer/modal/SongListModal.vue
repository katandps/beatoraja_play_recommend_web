<script setup lang="ts">
import { ref } from "vue"
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import SongDetail from "@/models/song_detail"
export interface ISongListModal {
  showModal: (title: string, text: SongDetail[]) => void
}

// --- ref ---
const modal_base = ref<IModalBase>()

// --- data ---
const title = ref("")
const song_list = ref<SongDetail[]>([])

// --- methods ---
const showModal = (ti: string, tx: SongDetail[]) => {
  title.value = ti
  song_list.value = tx
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
        <li v-for="(tx, index) in song_list" :key="index">{{ tx.title }}</li>
      </ul>
    </template>
  </ModalBaseVue>
</template>
