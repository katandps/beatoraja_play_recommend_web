<template>
  <div id="detail">
    <h1>クリア状況</h1>

    <label>
      <select class="form-control" name="level" v-model="selected_level">
        <option v-for="(level,key) in tables[table_index()].levels" :key="key">{{ level }}</option>
      </select>
    </label>

    <br/>
    <table class="table table-bordered">
      <thead>
      <tr>
        <td @click="set_sort('clear')" :class="{active : sort_key==='clear'}">Lv</td>
        <th @click="set_sort('title')"  :class="{active : sort_key==='title'}">Title</th>
        <td @click="set_sort('rate')"  :class="{active : sort_key==='rate'}">Rate</td>
        <td @click="set_sort('score')" :class="{active : sort_key==='score'}">EX/MAX</td>
        <td @click="set_sort('bp')"  :class="{active : sort_key==='bp'}">BP</td>
        <td @click="set_sort('combo')"  :class="{active : sort_key==='combo'}">Combo</td>
        <td @click="set_sort('play')"  :class="{active : sort_key==='play'}">Play</td>
        <td @click="set_sort('date')"  :class="{active : sort_key==='date'}">Date</td>
      </tr>
      </thead>
      <tr v-for="song in sorted" :class="'table-' + song.clear_type" :key="song.title">
        <td>{{ selected_level }}</td>
        <th>{{ song.title }}</th>
        <td>{{ (song.score / song.total_notes * 50).toFixed(2) }}</td>
        <td>{{ song.score }}/{{ song.total_notes * 2 }}</td>
        <td>{{ song.min_bp }}</td>
        <td>{{ song.max_combo }}/{{ song.total_notes }}</td>
        <td>{{ (song.play_count === -1) ? "---" : song.play_count }}</td>
        <td>{{ song.updated_at.split("T")[0] }}</td>
      </tr>
    </table>
  </div>
</template>

<script>

import config from '../const.js';

const song_format = [
  [
    {
      level: "",
      songs: [
        {
          title: "読込中",
          score: "2",
          min_bp: "1",
          max_combo: "1",
          clear_type: "NoPlay",
          updated_at: "1970-01-01T00:00:00+09:00",
          play_count: "0",
          total_notes: "1",
        }]
    }
  ]
];

export default {
  name: "Detail",
  props: {
    tables: {
      type: Array,
      required: true
    },
    selected_table: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data: () => ({
    songs: song_format,
    selected_level: "",
    sort_key: "clear",
  }),
  methods: {
    config() {
      return config;
    },
    fetch_detail() {
      fetch(process.env.VUE_APP_HOST + "detail/?date=" + this.date).then(response => {
        return response.json()
      })
          .then(json => {
            for (let i = 0; i < this.tables.length; i++) {
              this.songs.splice(i, 1, json[i].levels);
            }
          })
          .catch((err) => {
            this.msg = err
          });
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
    level_index() {
      for (let i = 0; i < this.tables[this.table_index()].levels.length; i++) {
        if (this.tables[this.table_index()].levels[i] === this.selected_level) {
          return i;
        }
      }
      this.selected_level = this.tables[this.table_index()].levels[0];
      return 0;
    },
    set_sort(key) {
      this.sort_key = key;
    },
  },
  created: function () {
    this.selected_level = this.tables[0].levels[0];

    const songs = Array(this.tables.length);
    songs.fill(song_format);
    this.songs = songs;
  },
  computed: {
    sorted: function () {
      let songs = this.songs[this.table_index()][this.level_index()].songs;
      if (!songs) {
        return song_format[0][0].songs;
      }
      let key = this.sort_key;
      let sortKey = function(song) {
        switch (key) {
          case "clear":
            return config.LAMP_TYPE.indexOf(song.clear_type);
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
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.fetch_detail();
      }
    }
  }
}

</script>

<style scoped>
.active {
  background-color: #e0e0e0;
}
</style>