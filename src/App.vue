<template>
  <div id="app" class="mx-auto container">

    <h1>Table Select</h1>
    <div>
      <label>
        <select class="form-control" name="table" v-model="selected_table">
          <option v-for="(table,key) in tables" :key="key">{{ table.name }}</option>
        </select>
      </label>
    </div>

    <h1>Date</h1>
    <div class="row justify-content-start">
      <datepicker class="col-6" format="yyyy-MM-dd" :bootstrap-styling="true" @closed="pickerClosed" name="date"
                  v-model="date" :language="ja"/>
      <button @click="reset_date">日付リセット</button>
    </div>

    <h1 @click="filter_visible">Filters{{ show_filter ? "▼" : "▶" }}</h1>
    <transition>
      <div v-show="show_filter">
        <h2>クリアタイプ</h2>
        <div v-for="lamp in config().LAMP_TYPE" :key="lamp" class="col-sm-4" style="display:inline">
          <label :for="lamp">
            <input type="checkbox" :id="lamp" :value="lamp" v-model="checked_lamp">
            {{ lamp }}
          </label>
        </div>

        <h2>スコアランク</h2>
        <div v-for="rank in config().RANK_TYPE" :key="rank" class="col-sm-4" style="display:inline">
          <label :for="rank">
            <input type="checkbox" :id="rank" :value="rank" v-model="checked_rank">
            {{ rank }}
          </label>
        </div>
      </div>
    </transition>

    <LampGraph :table="table" :lamps="current_lamps" v-if="has_loaded_songs"/>
    <RankGraph :table="table" :ranks="current_ranks" v-if="has_loaded_songs"/>
    <Detail :table="table" :songs="current_songs" v-if="has_loaded_songs"/>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker"
import {ja} from "vuejs-datepicker/dist/locale"

import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";
import RankGraph from "./components/RankGraph";
import config from "./const";

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
    checked_lamp: [],
    checked_rank: [],
    songs: [],
    ranks: [],
    show_filter: true,
  }),

  methods: {
    config() {
      return config;
    },
    fetch_tables() {
      fetch(process.env.VUE_APP_HOST + "tables/").then(response => {
        return response.json()
      }).then(json => {
        this.tables = json;
        this.selected_table = json[0].name;
      }).catch((err) => {
        console.error(err);
      });
    },
    fetch_detail() {
      fetch(process.env.VUE_APP_HOST + "detail/?date=" + this.date).then(response => {
        return response.json()
      }).then(json => {
        for (let i = 0; i < this.tables.length; i++) {
          this.songs.splice(i, 1, json[i].levels);
        }
      }).catch((err) => {
        console.error(err);
      });
    },
    pickerClosed() {
      this.date = dateFormatter.format(this.date);
    },
    reset_date() {
      this.date = dateFormatter.format(new Date());
    },
    filter_visible() {
      this.show_filter = !this.show_filter;
    }
  },
  computed: {
    has_loaded_tables() {
      return this.tables.length !== 0;
    },
    has_loaded_songs() {
      return this.songs.length !== 0;
    },
    table_index() {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].name === this.selected_table) {
          return i;
        }
      }
      console.error("難易度表が読み込まれてなさそうです");
      return 0;
    },
    table() {
      return this.tables[this.table_index];
    },
    current_songs() {
      if (!this.has_loaded_songs) {
        return [];
      }
      return this.songs[this.table_index].map(songs_by_level => new Object({
        level: songs_by_level.level,
        songs: songs_by_level.songs.filter(s =>
            this.checked_lamp.includes(s.clear_type)
            && this.checked_rank.includes(s.clear_rank))
      }));
    },
    current_ranks() {
      if (!this.has_loaded_songs) {
        return [];
      }
      return this.current_songs.map(songs_by_level => new Object(
          this.config().RANK_TYPE.reduce(
              (ret, rank) => ({
                ...ret,
                [rank]: songs_by_level.songs.filter(s => s.clear_rank === rank).length
              }),
              {}
          )
      ))
    },
    current_lamps() {
      if (!this.has_loaded_songs) {
        return [];
      }
      return this.current_songs.map(songs_by_level => new Object(
          this.config().LAMP_TYPE.reduce(
              (ret, lamp) => ({
                ...ret,
                [lamp]: songs_by_level.songs.filter(s => s.clear_type === lamp).length
              }),
              {}
          )
      ))
    }
  },
  created: function () {
    this.fetch_tables();
    this.checked_lamp = this.config().LAMP_TYPE;
    this.checked_rank = this.config().RANK_TYPE;
  },
  watch: {
    has_loaded_tables: {
      immediate: true,
      handler: function () {
        if (this.has_loaded_tables) {
          this.fetch_detail();
        }
      }
    },
    date: {
      immediate: true,
      handler: function () {
        if (this.has_loaded_tables) {
          this.fetch_detail();
        }
      }
    }
  }
}

</script>

<style>

</style>