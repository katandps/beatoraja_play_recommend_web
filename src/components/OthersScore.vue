<template>
  <div id="others_score">
    <Sidebar @setTable="set_table" @setDate="set_date" :model="model"/>
    <div class="main" id="page-wrap">
      ユーザーIDを入力
      <label>
        <input v-model="input_user_id">
      </label>
      <router-link class="btn btn-success" :to="'/view/?user_id=' + input_user_id">
        ユーザー変更
      </router-link>
      <div v-if="model.song_is_set()">
        <h2>{{ model.user_name() }}のデータ</h2>
        <Viewer :model="model"/>
      </div>
      <p v-else>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Sidebar from "./viewer/Sidebar";
import Model from "../models/model";

export default {
  name: "OthersScore",
  components: {Viewer, Sidebar},
  props: {
    user_id: {
      type: Number,
    }
  },
  data: () => ({
    input_user_id: null,
    model: Model.default(),
    message: "",
  }),
  async beforeMount() {
    this.input_user_id = this.user_id
    this.model = await this.model.init_table(this.$store.getters.accessToken)
    if (this.user_id) {
      await this.fetch_detail()
    }
  },
  methods: {
    async fetch_detail() {
      if (!this.user_id) {
        return;
      }
      this.message = "読込中...";
      this.model = await this.model.init_others_score(
          this.$store.getters.accessToken,
          this.user_id
      )
      this.message = this.model.song_is_set() ? "" : "読み込み失敗"
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
    user_id: {
      async handler() {
        if (this.user_id) {
          this.input_user_id = this.user_id;
          await this.fetch_detail()
        }
      }
    },
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