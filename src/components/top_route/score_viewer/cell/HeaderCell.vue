<script setup lang="ts">
import { useFilterStore } from "@/store/filter";
import { computed } from "vue"
import Columns from "../../../../models/columns"

const store = useFilterStore()

// --- props ---
interface Props {
  columns: Columns
  name: string
}
const props = defineProps<Props>()

// --- computed ---
const filter = computed(() => store.filter)
const is_active = computed(() => props.columns?.column_is_active(props.name))
const is_sorted = computed(() => filter.value.sort_key_is_active(props.name))

// --- method ---
const set_sort = () => store.setSort(props.name)
</script>

<template>
  <div class="th" v-show="is_active" :class="is_sorted ? 'sort_active' : 'sort_inactive'" @click="set_sort">
    <slot />
  </div>
</template>
