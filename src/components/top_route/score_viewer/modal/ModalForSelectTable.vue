<script setup>
import ModalBase from "./ModalBase"
import { DifficultyTable } from "../../../../models/difficultyTable"
import { ref, computed } from "vue"

// --- refs ---
const modal_base = ref(null)

// --- props ---
const props = defineProps({
  table_list: { required: true },
  level_list: { required: false },
  can_level_select: { type: Boolean },
  selected_table: { type: DifficultyTable, required: true },
  selected_level: { type: String },
  visible_all_level: { type: Boolean }
})

// --- emits ---
const emits = defineEmits(["setTable", "setLevel", "setVisibleAllLevelsFlag"])

// --- data ---
const title = ref("")

// --- computed ---
const table = computed({
  get: () => props.selected_table.name,
  set: (value) => emits("setTable", value)
})
const level = computed({
  get: () => props.selected_level,
  set: (value) => emits("setLevel", value)
})
const visible_all_levels = computed({
  get: () => !!props.visible_all_level,
  set: (value) => emits("setVisibleAllLevelsFlag", value)
})

// --- methods ---
const showModal = () => modal_base.value.show_modal()

// --- expose ---
defineExpose({ showModal })
</script>

<template>
  <ModalBase id="graph-modal" ref="modal_base">
    <template v-slot:header>
      <h2>{{ title }}</h2>
    </template>
    <template v-slot:body>
      <div class="input-group" role="group" aria-label="Difficulty Table">
        <div class="input-group-prepend">
          <label
            for="table"
            class="btn btn-info text-nowrap"
            v-tooltip="'表示する難易度表'"
          >
            難易度表
            <font-awesome-icon :icon="['fas', 'question-circle']" />
          </label>
        </div>
        <select id="table" class="form-control" name="table" v-model="table">
          <option v-for="(name, index) in table_list" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
      <hr />
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="all_level"
          v-model="visible_all_levels"
        />
        <label class="form-check-label" for="all_level">
          全難易度を表示対象にする
        </label>
      </div>
      <div v-if="!visible_all_levels">
        <div class="input-group" role="group" aria-label="Difficulty">
          <div class="input-group-prepend">
            <label
              for="level"
              class="btn btn-info text-nowrap"
              v-tooltip="'詳細表で表示する難易度'"
            >
              難易度
              <font-awesome-icon :icon="['fas', 'question-circle']" />
            </label>
          </div>
          <select id="level" class="form-control" name="level" v-model="level">
            <option v-for="(level, key) in level_list" :key="key">
              {{ level }}
            </option>
          </select>
        </div>
      </div>
    </template>
  </ModalBase>
</template>
