<template>
  <div id="others_score">
    ユーザーIDを入力 -
    <label>
      <input v-model="user_id">
    </label>
    <router-link class="btn btn-success" :to="'/view/?user_id=' + user_id">ユーザー変更</router-link>
    <Viewer v-if="!!songs" :songs="songs" title="他人のスコア" @fetch_detail="fetch_detail"
            @update_date="update_date"/>
    <p v-else>ユーザーが存在しません</p>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Api from "../api";

export default {
  name: "OthersScore",
  components: {Viewer},
  props: {
    id: {
      type: Number,
      default: 1,
    }
  },
  data: () => ({
    songs: null,
    user_id: null,
    date: "",
  }),
  methods: {
    async fetch_detail() {
      const songs = await Api.fetch_others_score(this.date, this.id, this.$cookies.get("session-token"));
      this.songs = songs ? songs : null;
    },
    update_date(date) {
      this.date = date;
    },
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.fetch_detail()
      }
    },
    id: {
      immediate: true,
      handler: function () {
        if (this.id) {
          this.fetch_detail();
          this.user_id = "" + this.id;
        }
      }
    }
  }
}
</script>

<style scoped>
#others_score {
  padding-top: 20px;
}
</style>