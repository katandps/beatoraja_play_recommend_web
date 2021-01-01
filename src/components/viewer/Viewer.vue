<template>
  <div id="viewer">
    <div v-if="table">
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
import Filter from "../../models/filter";
import {Table} from "../../models/table";

export default {
  name: "Viewer",
  components: {LampGraph, Detail, RankGraph},
  props: {
    filter: {
      type: Filter,
      require: true,
    },
    songs: {
      type: AllDetail,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    table: {
      type: Table,
      require: true,
    }
  },
  methods: {
    config() {
      return config;
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

<style scoped></style>
