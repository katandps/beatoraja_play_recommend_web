<template>
  <section id="score-table">
    <div class="row">
      <InputUserId :user_id="user_id" @refresh="refreshUserId" class="col-sm-6"/>
      <DateSelector @setDate="set_date" class="col-sm-6"/>
    </div>
    <hr>
    <div v-if="model.is_initialized()">
      <score-viewer-header :model="model"/>
      <div>
        <div class="form-group row">
          <div class="col-sm-12">
            <router-link :to="{path: '/view/lamp', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                クリアランプ
              </div>
            </router-link>
            <router-link :to="{path: '/view/rank', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                スコアランク
              </div>
            </router-link>
            <router-link :to="{path: '/view/stat', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                統計
                <font-awesome-icon :icon="['fas', 'wrench']"/>
              </div>
            </router-link>
            <router-link :to="{path: '/view/', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                詳細
              </div>
            </router-link>
            <router-link :to="{path: '/view/recent', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                最近更新
              </div>
            </router-link>
            <router-link :to="{path: '/view/rival', query: $route.query}">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                ライバル比較
              </div>
            </router-link>
          </div>
        </div>

        <hr>
        <router-view :model="model" :rival_id="rival_id" />
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </section>
</template>

<script>
import Model from "../../models/model"
import InputUserId from "./score_viewer/selector/InputUserId"
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader"
import DateSelector from "./score_viewer/selector/DateSelector"
import Api from "../../api"
import * as log from "loglevel"
import SongFilter from "../../models/songFilter"

export default {
  name: "ScoreViewer",
  components: {
    ScoreViewerHeader,
    InputUserId,
    DateSelector,
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
    header_visible: true,
    message: "",
    loaded: {user_id: null, rival_id: null, date: ""},
  }),
  async beforeMount() {
    log.debug(this.$store.getters.filter)
    this.$store.commit('setFilter', new SongFilter(this.$store.getters.filter))
    Api.fetch_tables(this.$store.getters.accessToken).then(
        t => this.model = this.model.init_table(t)
    )
    Api.fetch_songs(this.$store.getters.accessToken).then(
        s => this.model = this.model.init_songs(s)
    )
    await this.fetch_detail(this.$route.query)
    // await this.set_rival(this.rival_id)
  },
  methods: {
    async refreshUserId(input_user_id) {
      let query = Object.assign({}, this.$route.query)
      query.user_id = input_user_id
      await this.$router.push({query: query})
    },

    async set_rival() {
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

    async fetch_detail() {
      log.debug(this.user_id)
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
    '$route' () {
      this.fetch_detail()
      this.set_rival()
    },
  }
}
</script>

<style scoped>
#score-table {
  padding-top: 20px;
}
</style>