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
      <SongDetail
          v-for="song in songs[table_index()][level_index()].songs"
          :key="song.title"
          :level="selected_level"
          :title="song.title"
          :score="song.snap.score"
          :min_bp="song.snap.min_bp"
          :max_combo="song.snap.max_combo"
          :clear_type="song.snap.clear_type"
          :updated_at="song.snap.updated_at"
      />
    </table>
  </div>
</template>

<script>
import SongDetail from "./SongDetail";

const song_format = [
  [
    {
      level: "",
      songs: [
        {
          title: "",
          snap: {
            score: "",
            min_bp: "",
            max_combo: "",
            clear_type: "",
            updated_at: "",
          }
        }]
    }
  ]
];

export default {
  name: "Detail",
  components: {SongDetail},
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
    fetch_detail(index) {
      fetch("https://bms.katand.net/detail/" + index).then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            this.songs.splice(index, 1, json.Detail.levels);
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
    for (let i = 0; i < this.tables.length; i++) {
      this.fetch_detail(i);
    }
  }
}
</script>

<style scoped></style>