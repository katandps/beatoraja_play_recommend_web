<template>
  <section id="score-table">
    <InputUserId :user_id="user_id" @refresh="refreshUserId" class="col-sm-8"/>
    <hr>
    <div v-if="model.is_initialized()">
      <score-viewer-header :model="model" :mode="mode"/>
      <div>
        <div class="form-group row">
          <div class="btn-group col-sm-12">
            <label class="btn btn-outline-secondary col-sm-3 text-nowrap">
              <input type="radio" :checked="mode==='lamp'" @click="changeMode('lamp')" value="lamp"/>
              ランプグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-3 text-nowrap">
              <input type="radio" :checked="mode==='rank'" @click="changeMode('rank')" value="rank"/>
              ランクグラフ
            </label>
            <label class="btn btn-outline-secondary col-sm-3 text-nowrap">
              <input type="radio" :checked="mode==='detail'" @click="changeMode('detail')" value="detail"/>
              詳細表
            </label>
            <label class="btn btn-outline-secondary col-sm-3 text-nowrap">
              <input type="radio" :checked="mode==='recent'" @click="changeMode('recent')" value="recent"/>
              最近更新
              <font-awesome-icon :icon="['fas', 'wrench']"/>
            </label>
            <label class="btn btn-outline-secondary col-sm-3 text-nowrap">
              <input type="radio" :checked="mode==='rival'" @click="changeMode('rival')" value="rival"/>
              ライバル比較
              <font-awesome-icon :icon="['fas', 'wrench']"/>
            </label>
          </div>
        </div>

        <DateSelector @setDate="set_date"/>
        <hr>
        <LampGraph :model="model" v-if="mode === 'lamp'"/>
        <RankGraph :model="model" v-if="mode === 'rank'"/>
        <Detail :model="model" v-if="mode === 'detail'"/>
        <Recent :model="model" v-if="mode === 'recent'"/>
        <Rival :model="model" v-if="mode === 'rival'" :rival_id="rival_id" @updateRival="set_rival"/>
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </section>
</template>

<script>
import Model from "../models/model"
import InputUserId from "./score_viewer/InputUserId"
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader"
import DateSelector from "./score_viewer/DateSelector"
import LampGraph from "./score_viewer/LampGraph"
import Detail from "./score_viewer/Detail"
import Recent from "./score_viewer/Recent"
import RankGraph from "./score_viewer/RankGraph"
import Rival from "./score_viewer/Rival"
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
    Recent,
    Rival,
  },
  props: {
    user_id: {
      type: Number,
    },
    mode: {
      type: String,
    },
    rival_id: {
      type: Number,
    }
  },
  data: () => ({
    model: Model.default(),
    message: "",
    loaded: {user_id: null, rival_id: null, date: ""},
  }),
  async beforeMount() {
    // this.model = this.model.init_filter(Object.assign(new SongFilter(), this.$store.getters.filter))
    Api.fetch_tables(this.$store.getters.accessToken).then(
        t => this.model = this.model.init_table(t)
    )
    Api.fetch_songs(this.$store.getters.accessToken).then(
        s => this.model = this.model.init_songs(s)
    )
    await this.fetch_detail(this.$route.query)
    await this.set_rival(this.rival_id)
  },
  methods: {
    async refreshUserId(input_user_id) {
      let query = Object.assign({}, this.$route.query)
      query.user_id = input_user_id
      await this.fetch_detail(query)
    },

    async set_rival(input_rival_id) {
      let query = Object.assign({}, this.$route.query)
      query.rival_id = input_rival_id
      await this.$router.push({name: 'ScoreViewer', query: query}).catch(() => {
      })

      if (this.loaded.rival_id !== this.rival_id) {
        await Api.fetch_score(
            this.model.get_date_str(),
            this.rival_id,
            this.$store.getters.accessToken
        ).then(s => {
          this.model = this.model.renew_with_rival_score(s)
        })
        this.loaded.rival_id = this.rival_id
      }
    },

    async fetch_detail(query) {
      if (!this.user_id) {
        return
      }

      log.debug(query)
      await this.$router.push({name: 'ScoreViewer', query: query}).catch(() => {
      })

      log.debug(this.user_id, this.loaded)
      if (this.loaded.user_id !== this.user_id || this.loaded.date !== this.model.get_date_str()) {
        log.debug("fetch!")
        this.message = "読込中..."
        await Api.fetch_score(
            this.model.get_date_str(),
            this.user_id,
            this.$store.getters.accessToken
        ).then(s => {
          this.model = this.model.init_score(s)
          this.message = this.model.score_is_set() ? "" : "読み込み失敗"
        })
        this.loaded.user_id = this.user_id
        this.loaded.date = this.model.get_date_str()
      }

    },

    async changeMode(mode) {
      let query = Object.assign({}, this.$route.query)
      query.mode = mode
      await this.$router.push({name: 'ScoreViewer', query: query}).catch(() => {
      })
    },

    /**
     * @public
     * @param {Date} date
     */
    async set_date(date) {
      this.model = this.model.set_date(date)
      await this.fetch_detail()
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