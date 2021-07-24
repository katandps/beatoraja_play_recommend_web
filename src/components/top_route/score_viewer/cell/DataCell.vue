<template>
  <div class="td" v-if="is_active" @click="click">
    <slot />
  </div>
</template>

<script>
export default {
  name: "DataCell",
  props: {column_name: String},
  methods: {
    click() {
      this.$emit('click')
    }
  },
  computed: {
    is_active() {
      return this.$store.getters.filter.column_is_active(this.column_name)
    }
  }
}
</script>