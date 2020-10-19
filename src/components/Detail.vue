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
        <td>Lv</td>
        <th>Title</th>
        <td>Rate</td>
        <td>EX/MAX</td>
        <td>BP</td>
        <td>Combo</td>
        <td>Play</td>
        <td>Date</td>
      </tr>
      </thead>
      <tr v-for="song in sorted" :class="'table-' + song.clear_type" :key="song.title">
        <td>{{ selected_level }}</td>
        <th>{{ song.title }}</th>
        <td>{{ (song.score / song.total_notes * 50).toFixed(2) }}</td>
        <td>{{ song.score }}/{{ song.total_notes * 2 }}</td>
        <td>{{ song.min_bp }}</td>
        <td>{{ song.max_combo }}/{{ song.total_notes }}</td>
        <td>{{ song.play_count }}</td>
        <td>{{ song.updated_at.split("T")[0] }}</td>
      </tr>
    </table>
  </div>
</template>

<script>

const song_format = [
  [
    {
      level: "",
      songs: [
        {
          title: "読込中",
          score: "1",
          min_bp: "1",
          max_combo: "1",
          clear_type: "NoPlay",
          updated_at: "1970-01-01",
          play_count: "1",
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
    }
  },
  data: () => ({
    songs: [song_format],
    selected_level: ""
  }),
  methods: {
    fetch_detail() {
      fetch(process.env.VUE_APP_HOST + "detail/").then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
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
    }
  },
  created: function () {
    this.selected_level = this.tables[0].levels[0];

    const songs = Array(this.tables.length);
    songs.fill(song_format);
    this.songs = songs;
    this.fetch_detail();
  },
  computed: {
    sorted: function () {
      let songs = this.songs[this.table_index()][this.level_index()].songs;
      if (!songs) {
        return song_format;
      }
      return songs.sort(function (a, b) {
        console.log(a);
        // let valA = a.title.toUpperCase(); // 大文字と小文字を無視する
        let valA = a.score;
        let valB = b.score;
        // let valB = b.title.toUpperCase(); // 大文字と小文字を無視する
        if (valA < valB) {
          return -1;
        } else if (valA > valB) {
          return 1;
        } else {
          return 0;
        }
      })
    }
  }
}
</script>

<style scoped></style>