<template>
  <div id="date-selector">
    <div>
      <datepicker :bootstrap-styling="true" name="date" v-model="date" :language="ja" :inline="true"/>
    </div>
    <div>
      <button @click="reset_date" class="btn btn-danger reset">日付リセット</button>
    </div>
  </div>
</template>

<script>
import {ja} from "vuejs-datepicker/dist/locale";
import Datepicker from "vuejs-datepicker"
import config from "../../const.js"

export default {
  name: "DateSelector",
  components: {Datepicker},
  data: () => ({
    ja: ja,
    date: new Date(new Date().setHours(0, 0, 0, 0)),
  }),
  methods: {
    reset_date() {
      this.date = new Date(new Date().setHours(0, 0, 0, 0));
    },
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.$emit('getDate', config.dateFormatter.format(this.date));
      }
    }
  }
}
</script>

<style scoped>
#date-selector {
  width: 320px;
  box-sizing: border-box;
}

.reset {
  margin: 20px 0 0 0;
  width: 100%;
}

</style>