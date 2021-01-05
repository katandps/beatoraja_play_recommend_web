<template>
  <div id="date-selector">
    <h6 class="sidebar-title" @click="selector_visible">日付選択{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <div class="calendar">
          <datepicker :bootstrap-styling="true" name="date" v-model="date" :language="ja" :inline="true"/>
        </div>
        <div>
          <button @click="reset_date" class="btn btn-danger reset">日付リセット</button>
        </div>
      </div>
    </transition>
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
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    show: false,
  }),
  methods: {
    reset_date() {
      this.date = new Date(new Date().setHours(0, 0, 0, 0));
    },
    selector_visible() {
      this.show = !this.show;
    }
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
  box-sizing: border-box;
}

.reset {
  margin: 20px 0 0 0;
  width: 240px;
}

.calendar {
  width: 100%;
}

/deep/ .vdp-datepicker__calendar {
  width: 240px !important;
  color: #000000;
}
</style>