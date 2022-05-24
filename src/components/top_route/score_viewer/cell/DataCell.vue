<script setup lang="ts">
import { computed } from "vue"
import Columns from "../../../../models/columns"

// --- props ---
interface Props {
  columns: Columns
  name: string
}
const props = defineProps<Props>()

// --- emits ---
const emits = defineEmits(["click"])

// --- computed ---
const is_active = computed(() => props.columns.column_is_active(props.name))

// --- method ---
const click = () => emits("click")
</script>

<template>
  <div class="td" v-if="is_active" @click="click">
    <slot />
  </div>
</template>
