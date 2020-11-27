<template>
  <div id="app" class="mx-auto container">

    <h1>難易度表選択</h1>
    <label>
      <select class="form-control" name="table" v-model="selected_table">
        <option v-for="(table,key) in tables" :key="key">{{ table.name }}</option>
      </select>
    </label>

    <h1>日付選択</h1>
    <div class="row justify-content-start">
      <datepicker class="col-3" format="yyyy-MM-dd" :bootstrap-styling="true" @closed="pickerClosed" name="date"
                  v-model="date" :language="ja"/>
      <button @click="reset_date">日付リセット</button>
    </div>

    <LampGraph :tables="tables" :selected_table="selected_table" :date="date" v-if="has_loaded_tables"/>
    <RankGraph :tables="tables" :selected_table="selected_table" :date="date" v-if="has_loaded_tables"/>
    <Detail :tables="tables" :selected_table="selected_table" :date="date" v-if="has_loaded_tables"/>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker"
import {ja} from "vuejs-datepicker/dist/locale"

import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";
import RankGraph from "./components/RankGraph";

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
  name: "App",
  components: {LampGraph, Detail, RankGraph, Datepicker},
  data: () => ({
    tables: [],
    selected_table: "",
    ja: ja,
    date: dateFormatter.format(new Date()),
  }),

  methods: {
    fetch_tables() {
      fetch(process.env.VUE_APP_HOST + "tables/").then(response => {
        return response.json()
      }).then(json => {
        console.log(json);
        this.tables = json;
        this.selected_table = json[0].name;
      }).catch((err) => {
        console.error(err);
      });
    },
    pickerClosed() {
      this.date = dateFormatter.format(this.date);
    },
    reset_date() {
      this.date = dateFormatter.format(new Date());
    }
  },
  computed: {
    has_loaded_tables() {
      return this.tables.length !== 0;
    }
  },
  created: function () {
    this.fetch_tables();
  }
};
</script>

<style></style>