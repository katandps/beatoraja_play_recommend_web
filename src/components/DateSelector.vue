<template>
  <div id="date-selector">
    <h2>Date</h2>
    <div class="row justify-content-start">
      <datepicker class="col-6" format="yyyy-MM-dd" :bootstrap-styling="true" @closed="pickerClosed" name="date"
                  v-model="date" :language="ja"/>
      <button @click="reset_date">日付リセット</button>
    </div>
  </div>
</template>

<script>
import {ja} from "vuejs-datepicker/dist/locale";
import Datepicker from "vuejs-datepicker"
import config from "../const.js"

export default {
  name: "DateSelector",
  components: {Datepicker},
  data: () => ({
    ja: ja,
    date: config.dateFormatter.format(new Date(new Date().setHours(0, 0, 0, 0))),
  }),
  methods: {
    pickerClosed() {
      this.date = config.dateFormatter.format(this.date);
    },
    reset_date() {
      this.date = config.dateFormatter.format(new Date(new Date().setHours(0, 0, 0, 0)));
    },
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.$emit('update', this.date);
      }
    }
  }
}
</script>

<style scoped>

</style>