<template>
  <div id="viewer">
    <Sidebar
        @getTable="fetch_table"
        @getDate="update_date"
        :filter="filter"
    />
    <div id="page-wrap" v-if="table">
      <h2>{{ title }}</h2>
      <LampGraph :table="table" :lamps="current_lamps" v-if="!!songs"/>
      <RankGraph :table="table" :ranks="current_ranks" v-if="!!songs"/>
      <Detail :table="table" :songs="current_songs" :filter="filter" v-if="!!songs"/>
    </div>
  </div>
</template>

<script>
import Detail from "./Detail";
import LampGraph from "./LampGraph";
import RankGraph from "./RankGraph";
import config from "../../const";
import AllDetail from "../../models/song.js";
import Sidebar from "./Sidebar";
import Filter from "../../models/filter";

export default {
  name: "Viewer",
  components: {LampGraph, Detail, RankGraph, Sidebar},
  props: {
    songs: {
      type: AllDetail,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
  },
  data: () => ({
    filter_days: 0,
    filter: new Filter(),
    table: null,
  }),

  methods: {
    config() {
      return config;
    },
    update_date(date) {
      this.$emit("update_date", date);
    },
    fetch_table(table) {
      this.table = table;
    },
  },
  computed: {
    current_songs() {
      if (this.table === null) {
        return [];
      }
      return this.filter.run(this.songs, this.table);
    },
    current_ranks() {
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
  padding-top: 10px;
  margin-left: calc(max(0px, calc(100% - 1060px)) / 2 + 340px); /* サイドメニュー分だけ長くする */
  margin-right: calc(max(0px, calc(100% - 1060px)) / 2 + 20px);
}
</style>
