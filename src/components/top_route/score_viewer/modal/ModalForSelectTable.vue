<script setup lang="ts">
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import Tables, { ActivatedTables } from "../../../../models/difficultyTable"
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
  checks: ActivatedTables
}
const props = defineProps<Props>()

// --- data ---

// --- methods ---
const showModal = () => modal_base.value?.showModal()

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
        <input type="checkbox" id="all_tables" :checked="ActivatedTables.is_all_active(props.checks, props.tables)"
          @change="ActivatedTables.check_all(props.checks, props.tables)" />
        <label for="all_tables">全選択</label>
      </h3>
      <hr />
      <div v-for="table in tables.tables" :key="table.name">
        <LevelSelectVue :table="table" :checks="ActivatedTables.get(checks, table)" />
      </div>
    </template>
  </ModalBaseVue>
</template>
