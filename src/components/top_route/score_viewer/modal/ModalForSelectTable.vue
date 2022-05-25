<script setup lang="ts">
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import Tables from "../../../../models/difficultyTable"
import { ref } from "vue"
import LevelSelectVue from "./LevelSelect.vue"
export interface IModalForSelectTable {
  showModal: () => void
}

// --- refs ---
const modal_base = ref<IModalBase>()

// --- props ---
interface Props {
  tables: Tables
}
defineProps<Props>()

// --- emits ---

const emits = defineEmits(["setLevel"])

// --- data ---

// --- methods ---
const showModal = () => modal_base.value?.showModal()
const setLevel = (level: string[], index: number) =>
  emits("setLevel", level, index)

// --- expose ---
defineExpose({ showModal })
</script>

<template>
  <ModalBaseVue id="graph-modal" ref="modal_base">
    <template v-slot:header>
      <h2>表示難易度選択</h2>
    </template>
    <template v-slot:body>
      <div>
        <div v-for="(table, index) in tables.tables" :key="table.name">
          <LevelSelectVue :table="table" :index="index" @setLevel="setLevel" />
        </div>
      </div>
    </template>
  </ModalBaseVue>
</template>
