<script setup lang="ts">
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import Tables from "../../../../models/difficultyTable"
import { ref } from "vue"

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
      <div>
        <div v-for="table in tables.tables" :key="table.name">
          <h3>{{ table.name }}</h3>
          <div class="btn" v-for="level in table.level_list" :key="level">
            <input
              type="checkbox"
              :id="level"
              v-model="table.checks"
              :value="level"
            />
            <label :for="level">{{ level }}</label>
          </div>
        </div>
      </div>
    </template>
  </ModalBaseVue>
</template>
