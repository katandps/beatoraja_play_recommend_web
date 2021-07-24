<template>
  <div class="th"
       v-show="is_active"
       :class="is_sorted"
       @click="set_sort"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: "HeaderCell",
  props: {column_name: String},
  computed: {
    is_active() {
      return this.$store.getters.filter.column_is_active(this.column_name)
    },
    is_sorted() {
      return this.$store.getters.filter.sort_key_is_active(this.column_name)
    },
  },
  methods: {
    set_sort() {
      this.$store.commit('setSort', this.column_name)
    }
  }
}
</script>