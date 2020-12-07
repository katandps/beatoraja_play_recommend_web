<template>
  <div id="app">
    <Sidebar @getTable="fetch_table" @getDate="update_date" @updateFilter="update_filter"/>
    <div id="page-wrap">
      <LampGraph :table="table" :lamps="current_lamps" v-if="has_loaded_songs"/>
      <RankGraph :table="table" :ranks="current_ranks" v-if="has_loaded_songs"/>
      <Detail :table="table" :songs="current_songs" v-if="has_loaded_songs"/>
    </div>
  </div>
</template>

<script>
import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";
import RankGraph from "./components/RankGraph";
import config from "./const";
import AllDetail from "./models/song.js";
import Sidebar from "./components/layouts/Sidebar";

export default {
  name: "App",
  components: {LampGraph, Detail, RankGraph, Sidebar},
  data: () => ({
    songs: null,
    date: "",
    visible_song: [],
    filter_days: 0,
    table: null,
  }),

  methods: {
    config() {
      return config;
    },
    fetch_detail() {
      fetch(process.env.VUE_APP_HOST + "detail/?date=" + this.date).then(response => {
        return response.json()
      }).then(json => {
        this.songs = new AllDetail(json);
      }).catch((err) => {
        console.error(err);
      });
    },
    update_date(date) {
      this.date = date;
    },
    update_filter(lamp, rank, day) {
      this.visible_song = lamp.concat(rank);
      this.filter_days = day;
    },
    fetch_table(table) {
      this.table = table;
    }
  },
  computed: {
    has_loaded_songs() {
      return this.songs !== null;
    },
    current_songs() {
      return this.has_loaded_songs ? this.songs.filtered(this.table, this.visible_song, this.filter_date) : [];
    },
    filter_date() {
      let date = new Date();
      date.setDate(date.getDate() - this.filter_days);
      return config.dateFormatter.format(date);
    },
    current_ranks() {
      if (!this.has_loaded_songs) {
        return [];
      }
      return this.current_songs.map(songs_by_level => new Object(
          [...config.RANK_TYPE].reduce(
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
          [...config.LAMP_TYPE].reduce(
              (ret, lamp) => ({
                ...ret,
                [lamp]: songs_by_level.songs.filter(s => s.clear_type === lamp).length
              }),
              {}
          )
      ))
    }
  },
  watch: {
    table: {
      immediate: true,
      handler: function () {
        if (this.table) {
          this.fetch_detail();
        }
      }
    },
    date: {
      immediate: true,
      handler: function () {
        if (this.table) {
          this.fetch_detail();
        }
      }
    }
  }
}
</script>

<style>
.sidebar-area {
  /* 左側に固定 */
  float: left;
}

.footer-area {
  margin-top: 40px;
}

#page-wrap {
  /* display: flex; 要素を横並びにする */
  flex-direction: column; /* 要素の並び順の主軸を指定 上 => 下 */
  min-height: 100vh; /* 要素の高さの最小値を指定 vhはviewport(表示領域) heightの略 */
  min-width: 700px;
  max-width: 700px;
  padding-top: 40px;
  margin-left: calc(max(0px, calc(100% - 1060px)) / 2 + 340px); /* サイドメニュー分だけ長くする */
  margin-right: calc(max(0px, calc(100% - 1060px)) / 2 + 20px);
}
</style>
