<template>
  <div id="date-selector">
    <div class="form-group row align-items-center">
      <div class="input-group col-sm-6" role="group">
        <div class="input-group-prepend">
          <div class="btn btn-info text-nowrap">
            日付
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </div>
        </div>
        <datepicker id="picker"
                    input-class="form-control"
                    name="date"
                    v-model="date"
                    :language="ja" :format="datePickerFormat"/>
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

<style scoped></style>