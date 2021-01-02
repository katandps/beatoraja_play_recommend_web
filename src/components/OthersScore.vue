<template>
  <div id="others_score">
    <Sidebar
        @setTable="set_table"
        @setDate="update_date"
        :filter="filter"
    />
    <div class="main" id="page-wrap">
      ユーザーIDを入力
      <label>
        <input v-model="user_id">
      </label>
      <router-link class="btn btn-success" :to="'/view/?user_id=' + user_id">ユーザー変更</router-link>
      <Viewer
          v-if="!!songs"
          :songs="songs"
          :filter="filter"
          :table="table"
          title="他人のスコア"
          @fetch_detail="fetch_detail"
          @update_date="update_date"
      />
      <p v-else>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Api from "../api";
import Filter from "../models/filter";
import Sidebar from "./viewer/Sidebar";

export default {
  name: "OthersScore",
  components: {Viewer, Sidebar},
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
    filter: new Filter(),
    table: null,
    message: ""
  }),
  methods: {
    async fetch_detail() {
      if (!this.id || !this.date) {
        return;
      }
      this.message = "読込中...";
      this.songs = null;
      const songs = await Api.fetch_others_score(this.date, this.id, this.$store.getters.accessToken);
      this.songs = songs ? songs : null;
      if (songs === null) {
        this.message = "読み込み失敗"
      }
    },
    update_date(date) {
      this.date = date;
    },
    set_table(table) {
      this.table = table;
    }
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
.main {
  padding-top: 20px;
}

#page-wrap {
  flex-direction: column; /* 要素の並び順の主軸を指定 上 => 下 */
  min-height: 100vh; /* 要素の高さの最小値を指定 vhはviewport(表示領域) heightの略 */
  min-width: 700px;
  max-width: 700px;
  padding-top: 20px;
  margin-left: calc(max(0px, calc(100% - 1060px)) / 2 + 340px); /* サイドメニュー分だけ長くする */
  margin-right: calc(max(0px, calc(100% - 1060px)) / 2 + 20px);
}
</style>