<template>
  <div id="detail">
    <h1 @click="visible">Detail{{ show ? "▼" : "▶" }}</h1>

    <transition>
      <div style="width:100%" v-show="show">
        <label>
          <select class="form-control" name="level" v-model="selected_level">
            <option v-for="(level,key) in table.levels" :key="key">{{ level }}</option>
          </select>
        </label>
        <label for="all_list">
          <input type="checkbox" id="all_list" v-model="all_list">
          ALL
        </label>

        <br/>
        <table class="table detail">
          <thead>
            <td @click="set_sort('clear')" :class="{active : sort_key==='clear'}"></td>
            <td @click="set_sort('level')" :class="{active : sort_key==='level'}">Lv</td>
            <td @click="set_sort('title')" :class="{active : sort_key==='title'}">Title</td>
            <td @click="set_sort('rate')" :class="{active : sort_key==='rate'}">Rate</td>
            <td @click="set_sort('score')" :class="{active : sort_key==='score'}">EX/MAX</td>
            <td @click="set_sort('bp')" :class="{active : sort_key==='bp'}">BP</td>
            <td @click="set_sort('combo')" :class="{active : sort_key==='combo'}">Combo</td>
            <td @click="set_sort('play')" :class="{active : sort_key==='play'}">Play</td>
            <td @click="set_sort('date')" :class="{active : sort_key==='date'}">Date</td>
          </thead>
          <tr v-for="(song, index) in sorted" :key="song.title + index">
            <td :class="'table-' + song.clear_type"></td>
            <td :class="'table-line-' + song.clear_type">{{ song.level }}</td>
            <td :class="'table-line-' + song.clear_type">{{ song.title }}</td>
            <td :class="'table-line-' + song.clear_type">{{ (song.score / song.total_notes * 50).toFixed(2) }}</td>
            <td :class="'table-line-' + song.clear_type">{{ song.score }}/{{ song.total_notes * 2 }}</td>
            <td :class="'table-line-' + song.clear_type">{{ song.min_bp }}</td>
            <td :class="'table-line-' + song.clear_type">{{ song.max_combo }}/{{ song.total_notes }}</td>
            <td :class="'table-line-' + song.clear_type">{{ (song.play_count === -1) ? "---" : song.play_count }}</td>
            <td :class="'table-line-' + song.clear_type">{{ song.updated_at.split("T")[0] }}</td>
          </tr>
        </table>
      </div>
    </transition>
  </div>
</template>

<script>

import config from '../const.js';

export default {
  name: "Detail",
  props: {
    table: {
      type: Object,
      required: true
    },
    songs: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    selected_level: "",
    sort_key: "clear",
    show: true,
    all_list: false,
  }),
  methods: {
    config() {
      return config;
    },
    level_index() {
      for (let i = 0; i < this.table.levels.length; i++) {
        if (this.table.levels[i] === this.selected_level) {
          return i;
        }
      }
      this.selected_level = this.table.levels[0];
      return 0;
    },
    set_sort(key) {
      this.sort_key = key;
    },
    visible() {
      this.show = !this.show;
    }
  },
  created: function () {
    this.selected_level = this.table.levels[0];
  },
  computed: {
    active: function () {
      if (this.all_list) {
        return this.songs.map(songs_by_level => songs_by_level.songs).flat();
      } else {
        return this.songs[this.level_index()].songs;
      }
    },
    sorted: function () {
      let songs = this.active;
      if (!songs) {
        return this.config().SONG_FORMAT[0][0].songs;
      }
      let key = this.sort_key;
      let sortKey = function (song) {
        switch (key) {
          case "level":
            return this.table.levels.indexOf(song.level);
          case "clear":
            return this.config().LAMP_TYPE.indexOf(song.clear_type);
          case "title":
            return song.title.toLowerCase();
          case "rate":
            return (song.score / song.total_notes * 50).toFixed(2)
          case "score":
            return song.score;
          case "bp":
            return song.min_bp;
          case "combo":
            return song.max_combo;
          case "play":
            return song.play_count;
          case "date":
            return song.updated_at;
          default:
            return ""
        }
      }.bind(this);
      return songs.sort(function (a, b) {
        let valA = sortKey(a);
        let valB = sortKey(b);
        if (valA < valB) {
          return -1;
        } else if (valA > valB) {
          return 1;
        } else {
          return 0;
        }
      })
    }
  },

}

</script>

<style scoped>
.active {
  background-color: #e0e0e0;
}
</style>