<template>
  <div id="detail">
    <h1 @click="visible">Detail{{ show ? "▼" : "▶" }}</h1>

    <transition>
      <div style="width:100%" v-show="show">
        <label class="col-2">
          <select class="form-control" name="level" v-model="selected_level">
            <option v-for="(level,key) in table.levels" :key="key">{{ level }}</option>
          </select>
        </label>
        <label for="all_list" class="col-2">
          <input type="checkbox" id="all_list" v-model="all_list">
          全曲表示
        </label>
        <label for="desc" class="col-2">
          <input type="checkbox" id="desc" v-model="desc">
          降順
        </label>

        <br/>
        <table class="table detail">
          <thead>
          <td @click="set_sort('clear')" :class="{active : sort_key==='clear'}"></td>
          <td @click="set_sort('level')" :class="{active : sort_key==='level'}">Lv</td>
          <td @click="set_sort('title')" :class="{active : sort_key==='title'} +' title'">Title</td>
          <td @click="set_sort('rate')" :class="{active : sort_key==='rate'}">Rate</td>
          <td @click="set_sort('score')" :class="{active : sort_key==='score'}">EX/MAX</td>
          <td @click="set_sort('bp')" :class="{active : sort_key==='bp'}">BP</td>
          <td @click="set_sort('combo')" :class="{active : sort_key==='combo'}">Combo</td>
          <td @click="set_sort('play')" :class="{active : sort_key==='play'}">Play</td>
          <td @click="set_sort('date')" :class="{active : sort_key==='date'} + ' date'">Date</td>
          </thead>
          <tr v-for="(song, index) in sorted" :key="song.title + index">
            <td :class="'table-' + song.clear_type"></td>
            <td :class="clear_type_class(song)">{{ song.level }}</td>
            <td :class="clear_type_class(song)" class="title">{{ song.title }}</td>
            <td :class="clear_type_class(song) + ' bg-' + song.clear_rank">{{ song.score_rate() }}</td>
            <td :class="clear_type_class(song)">{{ song.score }}/{{ song.total_notes * 2 }}</td>
            <td :class="clear_type_class(song)">{{ song.min_bp }}</td>
            <td :class="clear_type_class(song)">{{ song.max_combo }}/{{ song.total_notes }}</td>
            <td :class="clear_type_class(song)">{{ (song.play_count === -1) ? "---" : song.play_count }}</td>
            <td :class="clear_type_class(song)" class="date">{{ song.updated_at.split("T")[0] }}</td>
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
    desc: true,
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
    },
    clear_type_class(song) {
      return "table-line-" + song.clear_type;
    },
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
            return this.config().LAMP_TYPE.length - this.config().LAMP_TYPE.indexOf(song.clear_type);
          case "title":
            return song.title.toLowerCase();
          case "rate":
            return song.score_rate();
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
        return valA === valB ? 0 : ((valA < valB) ^ this.desc) ? -1 : 1;
      }.bind(this))
    }
  },

}

</script>

<style scoped>
.active {
  background-color: #e0e0e0;
}

.title {
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>