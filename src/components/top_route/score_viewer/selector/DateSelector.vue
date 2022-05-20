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
      <label @click="openPicker" class="form-input col-sm-7">{{
        picked
      }}</label>
      <DatePicker ref="pickerRef" />
      <label @click="resetDate" class="btn btn-danger col-sm-2">
        <font-awesome-icon :icon="['fas', 'undo']" />
      </label>
    </div>
  </div>
</template>

<script setup>
import DatePicker from "vue3-datepicker"
// import { DateFormatter } from "../../../../models/date_formatter"
import { computed, ref } from "vue"
const pickerRef = ref()

// --- computed
const picked = computed({
  get() {
    return this.date
  },
  set(value) {
    this.$emit("setDate", value)
  }
})

// --- methods
const openPicker = () => {
  console.log(pickerRef.value)
  pickerRef.value.showCalendar()
}
const resetDate = () => {
  picked.value.set(new Date(new Date().setHours(0, 0, 0, 0)))
}
</script>

<script>
export default {
  props: { date: Date },
  emits: ["setDate"]
}
</script>

<style scoped>
.v3dp__datepicker {
  display: none;
}
</style>
