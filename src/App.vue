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
          :level="1"
          :title="song.title"
          :score="song.snap.score"
          :min_bp="song.snap.min_bp"
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
            this.songs = json.Detail.levels[this.level].songs
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