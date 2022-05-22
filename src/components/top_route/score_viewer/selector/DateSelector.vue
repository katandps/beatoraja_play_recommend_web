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
      <label
        class="btn btn-info text-nowrap col-sm-3"
        v-tooltip="
          '指定した日付の当時の状態を再現します 右のボタンで今日に戻ります'
        "
      >
        日付
        <font-awesome-icon :icon="['fas', 'question-circle']" />
      </label>
      <DatePicker
        v-model="picked"
        class="col-sm-7"
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
