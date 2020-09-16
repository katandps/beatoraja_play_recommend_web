<template>
  <div id="detail">
    <label>
      <select class="form-control" name="table" v-model="selected_table">
        <option v-for="(table,key) in tables" :key="key">{{ table.name }}</option>
      </select>
    </label>
    <label>
      <select class="form-control" name="level" v-model="selected_level">
        <option v-for="(level,key) in tables[table_index()].levels" :key="key">{{ level }}</option>
      </select>
    </label>
    <br/>
    <button @click="fetch_detail">読み込む</button>

    <br/>
    {{ selected_table }}
    <table>
      <SongDetail
          v-for="song in songs[level_index()].songs"
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

export default {
  name: "Detail",
  components: {SongDetail},
  data: () => ({
    songs: [{songs:[]}],
    tables: [{"name": "", "levels": []}],
    selected_table: "",
    selected_level: ""
  }),
  methods: {
    fetch_detail() {
      fetch("https://bms.katand.net/detail/" + this.table_index()).then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            this.songs = json.Detail.levels;
          })
          .catch((err) => {
            this.msg = err
          });
    },
    fetch_tables() {
      fetch("https://bms.katand.net/tables/").then(response => {
        return response.json()
      }).then(json => {
        console.log(json);
        this.tables = json;
        this.selected_table = json[0].name;
        this.selected_level = json[0].levels[0];
      }).catch((err) => {
        console.error(err);
      });
    },
    table_index() {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].name === this.selected_table) {
          return i;
        }
      }
      return 0;
    },
    level_index() {
      for (let i = 0; i < this.tables[this.table_index()].levels.length; i++) {
        if (this.tables[this.table_index()].levels[i] === this.selected_level) {
          return i;
        }
      }
      return 0;
    }
  },
  created: function () {
    this.fetch_tables();
    this.fetch_detail();
  }
}
</script>

<style scoped>

</style>