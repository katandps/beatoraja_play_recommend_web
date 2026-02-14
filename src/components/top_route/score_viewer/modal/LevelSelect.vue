<script setup lang="ts">
import { ActivatedLevels, DifficultyTable } from "@/models/difficultyTable"

// --- props ---
interface Props {
  table: DifficultyTable
  checks: ActivatedLevels
}
const props = defineProps<Props>()

</script>

<template>
  <div>
    <slot name="header">
      <h3>
        <input type="checkbox" :id="'all_' + table.id" :checked="ActivatedLevels.is_all_active(props.checks)"
          @change="ActivatedLevels.check_all(props.checks, props.table)" />
        <label :for="'all_' + table.id">{{ table.name }}</label>
      </h3>
    </slot>
    <slot name="list">
      <div class="btn" v-for="level_label in table.level_list" :key="level_label">
        <input type="checkbox" :id="table.id + '_' + level_label"
          :checked="ActivatedLevels.is_active(props.checks, level_label)"
          @change="ActivatedLevels.change_active(props.checks, level_label)" />
        <label :for="table.id + '_' + level_label">{{ level_label }}</label>

      </div>
    </slot>
  </div>
</template>
