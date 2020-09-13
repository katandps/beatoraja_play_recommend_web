<template>
  <div id="app">
    <h1>クリア状況</h1>
    <input v-model="level"/>
    <br/>
    <button @click="read">読み込む</button>

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
import SongDetail from "./components/SongDetail";

export default {
  name: "App",
  components: {SongDetail},
  data: () => ({
    todos: [
      {id: 1, text: "tokimeki"}
    ],
    level: 0,
    levelStr: "",
    songs: [],
  }),
  computed: {
    isDisabled() {
      return this.message.length === 0;
    }
  },
  methods: {
    read() {
      fetch("https://bms.katand.net/detail/2").then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            this.levelStr = json.Detail.levels[this.level].level;
            this.songs = json.Detail.levels[this.level].songs;
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
};
</script>

<style></style>