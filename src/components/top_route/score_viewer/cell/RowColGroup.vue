<script setup lang="ts">
import config from "../../../../const"
import { computed } from "vue"
import Columns from "../../../../models/columns"

// -- props --
const props = defineProps({
  columns: { type: Columns, require: true }
})

// --- computed ---
const active_columns = computed(() =>
  config.DETAIL_COLUMNS.filter((c) => props.columns?.column_is_active(c.name))
)
</script>

<template>
  <div class="colgroup">
    <div
      v-for="obj in active_columns"
      :key="obj.key"
      class="col"
      :class="obj.class"
      :columns="columns"
      :name="obj.key"
    />
  </div>
</template>
