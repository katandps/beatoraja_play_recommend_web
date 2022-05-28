<script setup lang="ts">
import { DifficultyTable } from "@/models/difficultyTable"
import { debug } from "loglevel"
import { computed } from "vue"

// --- props ---
interface Props {
  table: DifficultyTable
  index: number
}
const props = defineProps<Props>()

const emits = defineEmits(["setLevel"])

// --- data ---

// --- computed ---
const all_checked = computed({
  get: () => props.table.level_list.length === props.table.checks.length,
  set: (): string[] =>
    (check_accessor.value = all_checked.value ? [] : props.table.level_list)
})

const check_accessor = computed({
  get: () => props.table.checks,
  set: (item) => {
    debug(item, props.index)
    emits("setLevel", item, props.index)
  }
})
</script>

<template>
  <div>
    <slot name="header">
      <h3>
        <input type="checkbox" :id="'all_' + index" v-model="all_checked" />
        <label :for="'all_' + index">{{ table.name }}</label>
      </h3>
    </slot>
    <slot name="list">
      <div class="btn" v-for="item in table.level_list" :key="item">
        <input
          type="checkbox"
          :id="index + '_' + item"
          v-model="check_accessor"
          :value="item"
        />
        <label :for="index + '_' + item">{{ item }}</label>
      </div>
    </slot>
  </div>
</template>
