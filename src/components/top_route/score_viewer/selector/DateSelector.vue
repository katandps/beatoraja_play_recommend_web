<script setup>
import { computed } from "vue"

const props = defineProps({
  date: { type: Date }
})
const emits = defineEmits(["setDate"])

// --- computed
const picked = computed({
  get: () => props.date,
  set(value) {
    emits("setDate", value)
  }
})

// --- methods
const resetDate = () => {
  picked.value.set(new Date(new Date().setHours(0, 0, 0, 0)))
}
</script>

<template>
  <div id="date-selector">
    <div class="form-group align-items-center row">
      <DatePicker
        v-model="picked"
        class="col-sm-10"
        format="yyyy-MM-dd"
        :enableTimePicker="false"
      />
      <label @click="resetDate" class="btn btn-danger col-sm-2">
        <font-awesome-icon :icon="['fas', 'undo']" />
      </label>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.v3dp__datepicker {
  display: none;
}
</style>
