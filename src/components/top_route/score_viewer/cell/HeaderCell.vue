<script setup>
import { computed } from "vue"
import { useStore } from "vuex"
import Columns from "../../../../models/columns"

const store = useStore()

// --- props ---
const props = defineProps({
  columns: Columns,
  name: String
})

// --- computed ---
const filter = computed(() => store.getters.filter)
const is_active = computed(() => props.columns.column_is_active(props.name))
const is_sorted = computed(() => filter.value.sort_key_is_active(props.name))

// --- method ---
const set_sort = () => store.commit("setSort", props.name)
</script>

<template>
  <div class="th" v-show="is_active" :class="is_sorted" @click="set_sort">
    <slot />
  </div>
</template>
