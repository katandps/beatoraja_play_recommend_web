<script setup lang="ts">
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import Tables from "../../../../models/difficultyTable"
import { computed, ref } from "vue"
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
const props = defineProps<Props>()

// --- emits ---

const emits = defineEmits(["setLevel", "allTables"])

// --- data ---

// --- computed ---
const all_checked = computed({
  get: () => {
    for (const table of props.tables.tables) {
      if (table.checks.length !== table.level_list.length) {
        return false
      }
    }
    return true
  },
  set: () => {
    if (all_checked.value) {
      props.tables.tables.forEach((_, i) => setLevel([], i))
    } else {
      props.tables.tables.forEach((t, i) => {
        setLevel(t.level_list, i)
      })
    }
  }
})

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
      <h3>
        <input type="checkbox" id="all_tables" v-model="all_checked" />
        <label for="all_tables">全選択</label>
      </h3>
      <hr />
      <div v-for="(table, index) in tables.tables" :key="table.name">
        <LevelSelectVue :table="table" :index="index" @setLevel="setLevel" />
      </div>
    </template>
  </ModalBaseVue>
</template>
