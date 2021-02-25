<template>
  <div id="score-table">
    <InputUserId :user_id="user_id" @refreshData="fetch_detail"/>
    <hr>
    <div v-if="model.is_initialized()">
      <score-viewer-header :model="model"/>
      <div>
        <div class="form-group row">
          <div class="btn-group col-sm-12">
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" :checked="mode==='lamp'" @click="changeMode('lamp')" value="lamp"/>
              ランプグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" :checked="mode==='rank'" @click="changeMode('rank')" value="rank"/>
              ランクグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
              <input type="radio" :checked="mode==='detail'" @click="changeMode('detail')" value="detail"/>
              詳細表
            </label>
          </div>
        </div>

        <DateSelector @setDate="set_date"/>
        <TableSelector :model="model" @setTable="set_table"
                       v-if="model.tables_is_set ()"/>
        <hr>
        <LampGraph :model="model" v-if="mode === 'lamp'"/>
        <RankGraph :model="model" v-if="mode === 'rank'"/>
        <Detail :model="model" v-if="mode === 'detail'"/>
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script>
import Model from "../models/model"
import InputUserId from "./score_viewer/InputUserId"
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader"
import DateSelector from "./score_viewer/DateSelector"
import LampGraph from "./score_viewer/LampGraph"
import Detail from "./score_viewer/Detail"
import RankGraph from "./score_viewer/RankGraph"
import TableSelector from "./score_viewer/TableSelector"
import Api from "../api"
import * as log from "loglevel"

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
    },
    mode: {
      type: String,
    }
  },
  data: () => ({
    model: Model.default(),
    message: "",
    viewType: "detail",
    loaded: {user_id: null, date: ""},
  }),
  async beforeMount() {
    // this.model = this.model.init_filter(Object.assign(new SongFilter(), this.$store.getters.filter))
    Api.fetch_tables(this.$store.getters.accessToken).then(
        t => this.model = this.model.init_table(t)
    )
    Api.fetch_songs(this.$store.getters.accessToken).then(
        s => this.model = this.model.init_songs(s)
    )
    await this.fetch_detail()
  },
  methods: {
    async fetch_detail() {
      if (!this.user_id) {
        return
      }
      if (this.loaded.user_id === this.user_id && this.loaded.date === this.model.get_date_str()) {
        log.debug("load skipped")
        return
      }

      this.loaded.user_id = this.user_id
      this.loaded.date = this.model.get_date_str()
      this.message = "読込中..."
      Api.fetch_score(
          this.model.get_date_str(),
          this.user_id,
          this.$store.getters.accessToken
      ).then(s => {
        this.model = this.model.init_score(s)
        this.message = this.model.score_is_set() ? "" : "読み込み失敗"
      })
    },

    async changeMode(mode) {
      let query = Object.assign({}, this.$route.query)
      query.mode = mode
      await this.$router.push({name:'ScoreViewer', query: query}).catch(() => {})
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