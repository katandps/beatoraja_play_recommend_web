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

    <DateSelector @update="update_date"/>
    <SongFilter @update="update_filter"/>
    <LampGraph :table="table" :lamps="current_lamps" v-if="has_loaded_songs"/>
    <RankGraph :table="table" :ranks="current_ranks" v-if="has_loaded_songs"/>
    <Detail :table="table" :songs="current_songs" v-if="has_loaded_songs"/>
  </div>
</template>

<script>
import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";
import RankGraph from "./components/RankGraph";
import SongFilter from "./components/SongFilter";
import DateSelector from "./components/DateSelector";
import config from "./const";
import AllDetail from "./models/song.js";

export default {
  name: "App",
  components: {LampGraph, Detail, RankGraph, SongFilter, DateSelector},
  data: () => ({
    tables: [],
    songs: null,
    selected_table: "",
    date: "",
    visible_song: [],
    filter_days: 0,
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
    }
  },
  computed: {
    has_loaded_tables() {
      return this.tables.length !== 0;
    },
    has_loaded_songs() {
      return this.songs !== null;
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
      return this.has_loaded_songs ? this.songs.filtered(this.table_index, this.visible_song, this.filter_date) : [];

    },
    filter_date() {
      let date = new Date();
      date.setDate(date.getDay() - this.filter_days);
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
  created: function () {
    this.fetch_tables();
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

<style></style>
