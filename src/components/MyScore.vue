<template>
  <div id="my_score">
    <Sidebar
        @setTable="set_table"
        @setDate="update_date"
        :filter="filter"
    />
    <Viewer
        v-if="!!songs"
        :songs="songs"
        :filter="filter"
        :table="table"
        title="マイスコア"
        id="page-wrap"
        class="main"
        @fetch_detail="fetch_detail"
        @update_date="update_date"
    />
    <p v-else>{{message}}</p>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Api from "../api.js"
import Sidebar from "./viewer/Sidebar";
import Filter from "../models/filter";

export default {
  name: "MyScore",
  components: {Viewer, Sidebar},
  data: () => ({
    songs: null,
    date: "",
    table: null,
    filter: new Filter(),
    message: ""
  }),
  methods: {
    async fetch_detail() {
      if (!this.date) {
        return;
      }
      this.message = "読込中...";
      this.songs = await Api.fetch_my_score(this.date, this.$store.getters.accessToken);
      this.message = "";
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