<template>
  <data-cell class="date" :column_name="column_name">
    {{output}}
  </data-cell>
</template>

<script>
import DataCell from "./DataCell"

export default {
  name: "DateCell",
  components: {DataCell},
  props: {column_name: String, date: String},
  computed: {
    output() {
      let day = this.date.split('T')[0];
      if (day === '1970-01-01') {
        return '-'
      } else {
        return day
      }
    },
  }
}
</script>
