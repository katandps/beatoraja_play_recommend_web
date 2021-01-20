<template>
  <div id="score-table">
    <InputUserId :user_id="user_id" @refreshData="fetch_detail"/>
    <hr>
    <div v-if="model.song_is_set()">
      <score-viewer-header :model="model"/>
      <div v-if="model.is_initialized()">
        <div class="form-group row">
          <div class="btn-group col-sm-12">
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" v-model="viewType" value="lamp"/>
              ランプグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" v-model="viewType" value="rank"/>
              ランクグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" v-model="viewType" value="detail"/>
              詳細表
            </label>
          </div>
        </div>

        <DateSelector @setDate="set_date"/>
        <TableSelector :model="model" @setTable="set_table"
                       v-if="model.tables_is_set ()"/>
        <hr>
        <LampGraph :model="model" v-if="viewType === 'lamp'"/>
        <RankGraph :model="model" v-if="viewType === 'rank'"/>
        <Detail :model="model" v-if="viewType === 'detail'"/>
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script>
import Model from "../models/model";
import InputUserId from "./score_viewer/InputUserId";
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader";
import DateSelector from "./score_viewer/DateSelector";
import LampGraph from "./score_viewer/LampGraph";
import Detail from "./score_viewer/Detail";
import RankGraph from "./score_viewer/RankGraph";
import TableSelector from "./score_viewer/TableSelector";

export default {
  name: "ScoreViewer",
  components: {
    ScoreViewerHeader,
    InputUserId,
    DateSelector,
    LampGraph,
    Detail,
    RankGraph,
    TableSelector
  },
  props: {
    user_id: {
      type: Number,
    }
  },
  data: () => ({
    model: Model.default(),
    message: "",
    viewType: "detail"
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