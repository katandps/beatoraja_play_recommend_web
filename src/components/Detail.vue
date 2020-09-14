<template>
  <div id="detail">
    <label>
      <input v-model="level"/>
    </label>
    <br/>
    <button @click="read">読み込む</button>

    <br/>
    {{ title }}
    <table>
      <SongDetail
          v-for="song in songs"
          :key="song.title"
          :level="levelStr"
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
    level: 0,
    levelStr: "",
    title: "",
    songs: [],
  }),
  methods: {
    read() {
      fetch("https://bms.katand.net/detail/2").then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            this.levelStr = json.Detail.levels[this.level].level;
            this.songs = json.Detail.levels[this.level].songs;
            this.title = json.Detail.table;
          })
          .catch((err) => {
            this.msg = err
          });
    },
    add() {
      const newTodo = {
        id: this.todos.length + 1,
        text: this.message
      };
      this.todos.push(newTodo);
      this.message = "";
    },
    remove(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
    }
  }
}
</script>

<style scoped>

</style>