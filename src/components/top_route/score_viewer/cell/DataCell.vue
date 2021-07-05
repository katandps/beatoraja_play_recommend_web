<template>
  <div class="td" v-if="filter.column_is_active(column_name)" @click="click">
    <slot />
  </div>
</template>

<script>
import SongFilter from "../../../../models/songFilter"

export default {
  name: "DataCell",
  props: {filter: SongFilter, column_name: String},
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>