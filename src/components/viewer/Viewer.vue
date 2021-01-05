<template>
  <div id="viewer">
    <div v-if="model.song_is_set()">
      <LampGraph :table="table" :lamps="current_lamps"/>
      <RankGraph :table="table" :ranks="current_ranks"/>
      <Detail :model="model" v-if="model.table_is_set()"/>
    </div>
  </div>
</template>

<script>
import Detail from "./Detail";
import LampGraph from "./LampGraph";
import RankGraph from "./RankGraph";
import config from "../../const";
import Model from "../../models/model";

export default {
  name: "Viewer",
  components: {LampGraph, Detail, RankGraph},
  props: {
    model: {
      type: Model,
      require: true,
    }
  },
  methods: {
    config() {
      return config;
    },
  },
  computed: {
    table() {
      return this.model.selected_table
    },
    current_songs() {
      return this.model.filter.run(this.model.songs, this.table);
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
