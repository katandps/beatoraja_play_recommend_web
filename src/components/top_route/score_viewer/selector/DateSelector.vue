<template>
  <div id="date-selector">
    <div class="form-group">
      <div class="input-group" role="group">
        <div class="input-group-prepend">
          <div class="btn btn-info text-nowrap" v-tooltip="'指定した日付の当時の状態を再現します 右のボタンで今日に戻ります'">
            日付
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </div>
        </div>
        <div class="input-group-append">
          <div @click="reset_date" class="btn btn-danger text-nowrap">
            <font-awesome-icon :icon="['fas', 'undo']"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DateSelector",
  data: () => ({
    datePickerFormat: 'yyyy-MM-dd',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
  }),
  methods: {
    reset_date() {
      this.date = new Date(new Date().setHours(0, 0, 0, 0));
    },
  },
  watch: {
    date: {
      handler() {
        this.$emit('setDate', this.date);
      }
    }
  }
}
</script>

<style scoped></style>