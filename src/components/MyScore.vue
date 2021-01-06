<template>
  <div id="my_score">
    <Sidebar @setTable="set_table" @setDate="set_date" :model="model"/>
    <div class="main" id="page-wrap">
      <div>
        <h2 style="display:inline">マイスコア</h2>
        <a :href="model.get_twitter_link()" target="_blank" v-if="model.song_is_set()">
          <img src="../assets/twitter.png" alt="Twitterで共有" width="40" height="40">
        </a>
      </div>
      <Viewer v-if="model.song_is_set()" :model="model"/>
      <p v-else>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Sidebar from "./viewer/Sidebar";
import Model from "../models/model";
import Filter from "../models/filter";

export default {
  name: "MyScore",
  components: {Viewer, Sidebar},
  data: () => ({
    model: Model.default(),
    message: ""
  }),
  async beforeMount() {
    this.model = this.model.init_filter(Object.assign(new Filter(), this.$store.getters.filter))
    this.model = await this.model.init_table(this.$store.getters.accessToken)
    await this.fetch_detail()
  },
  methods: {
    async fetch_detail() {
      this.message = "読込中...";
      this.model = await this.model.init_my_score(
          this.$store.getters.accessToken,
      )
      this.message = this.model.song_is_set() ? "" : "読み込み失敗";
    },
    /**
     * @public
     * @param {Date} date
     */
    async set_date(date) {
      this.model = this.model.set_date(date)
      await this.fetch_detail()
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
  },
  watch: {
    date: {
      async handler() {
        await this.fetch_detail()
      }
    },
    model: {
      deep: true,
      handler() {
        this.$store.commit('setFilter', this.model.filter)
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