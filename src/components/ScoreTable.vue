<template>
  <div id="score-table">
    <InputUserId :user_id="user_id" @refreshData="fetch_detail"/>
    <hr>
    <div v-if="model.song_is_set()">
      <h2>
        {{ model.user_name() }}のデータ
        <a :href="model.get_twitter_link()" target="_blank"
           v-if="model.song_is_set()">
          <font-awesome-icon :icon="['fab', 'twitter-square']"/>
        </a>
      </h2>

      <Viewer :model="model" @setTable="set_table" @setDate="set_date"/>
    </div>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Model from "../models/model";
import InputUserId from "./InputUserId";

export default {
  name: "ScoreTable",
  components: {InputUserId, Viewer},
  props: {
    user_id: {
      type: Number,
    }
  },
  data: () => ({
    model: Model.default(),
    message: "",
  }),
  async beforeMount() {
    // this.model = this.model.init_filter(Object.assign(new SongFilter(), this.$store.getters.filter))
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
#score-table {
  padding-top: 20px;
}
</style>