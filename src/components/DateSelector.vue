<template>
  <div id="date-selector">
    <h1>Date</h1>
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

const dateFormatter = {
  _fmt: {
    "yyyy": function (date) {
      return date.getFullYear() + '';
    },
    "MM": function (date) {
      return ('0' + (date.getMonth() + 1)).slice(-2);
    },
    "dd": function (date) {
      return ('0' + date.getDate()).slice(-2);
    },
    "hh": function (date) {
      return ('0' + date.getHours()).slice(-2);
    },
    "mm": function (date) {
      return ('0' + date.getMinutes()).slice(-2);
    },
    "ss": function (date) {
      return ('0' + date.getSeconds()).slice(-2);
    }
  },
  _priority: ["yyyy", "MM", "dd", "hh", "mm", "ss"],
  format: function (date) {
    if (date && date instanceof Date) {
      return this._priority.reduce((res, fmt) => res.replace(fmt, this._fmt[fmt](date)), "yyyy-MM-dd")
    }
    return date;
  }
};

export default {
  name: "DateSelector",
  components: {Datepicker},
  data: () => ({
    ja: ja,
    date: dateFormatter.format(new Date()),
  }),
  methods: {
    pickerClosed() {
      this.date = dateFormatter.format(this.date);
    },
    reset_date() {
      this.date = dateFormatter.format(new Date());
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