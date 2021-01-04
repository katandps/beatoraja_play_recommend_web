<template>
  <div id="my_score" v-if="model">
    <Sidebar
        @setTable="set_table"
        @setDate="update_date"
        :model="model"
        :filter="filter"
    />
    <div id="page-wrap">
      <div v-if="!!songs">
        <h2 style="display:inline">マイスコア</h2>
        <a :href="link" target="_blank"><img src="twitter.png" alt="Twitterで共有" width="40" height="40"></a>
      </div>
      <Viewer
          v-if="!!songs"
          :songs="songs"
          :filter="filter"
          :model="model"
          class="main"
          @fetch_detail="fetch_detail"
          @update_date="update_date"
      />
      <p v-else>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Api from "../api.js"
import Sidebar from "./viewer/Sidebar";
import Filter from "../models/filter";
import Model from "../models/model";

export default {
  name: "MyScore",
  components: {Viewer, Sidebar},
  data: () => ({
    model: null,
    songs: null,
    date: "",
    filter: new Filter(),
    message: ""
  }),
  async mounted() {
    this.model = await Model.init(this.$store.getters.accessToken)
  },
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
      this.model.set_table(table)
    },
  },
  computed: {
    link() {
      if (!this.songs) {
        return "";
      }
      return "https://twitter.com/intent/tweet?url="
          + window.location.host + "/%23/view?user_id=" + this.songs.user_id;
    },
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