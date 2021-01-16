<template>
  <div id="date-selector" class="form-inline">
    <label for="picker" class="picker-title">日付選択</label>
    <datepicker id="picker" :bootstrap-styling="true" name="date" v-model="date"
                :language="ja" :format="datePickerFormat"/>
    <button @click="reset_date" class="btn btn-danger reset">日付リセット</button>
  </div>
</template>

<script>
import {ja} from "vuejs-datepicker/dist/locale";
import Datepicker from "vuejs-datepicker"

export default {
  name: "DateSelector",
  components: {Datepicker},
  data: () => ({
    ja: ja,
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
      handler: function () {
        this.$emit('setDate', this.date);
      }
    }
  }
}
</script>

<style scoped>
#date-selector {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  box-sizing: border-box;
}

.picker-title {
  margin-right: 20px;
}

#picker {
  margin-left: 20px;
}

.reset {
  margin-left: 20px;
}

/deep/ .vdp-datepicker__calendar {
  width: 240px !important;
  color: #000000;
}
</style>