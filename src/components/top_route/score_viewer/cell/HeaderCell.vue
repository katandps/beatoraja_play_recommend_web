<template>
  <div class="th"
       v-if="filter.column_is_active(column_name)"
       :class="filter.sort_key_is_active(column_name)"
       @click="filter.set_sort(column_name)"
  >
    <slot/>
  </div>
</template>

<script>
import SongFilter from "../../../../models/songFilter"

export default {
  name: "HeaderCell",
  props: {filter: SongFilter, column_name: String}
}
</script>

<style scoped>

</style>