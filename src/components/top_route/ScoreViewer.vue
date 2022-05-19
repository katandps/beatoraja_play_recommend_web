<template>
  <section id="score-table">
    <div class="row">
      <InputUserId :user_id="user_id" @refresh="refreshUserId" class="col-sm-6"/>
      <DateSelector @setDate="set_date" class="col-sm-6"/>
    </div>
    <hr>
    <div v-if="is_initialized">
      <score-viewer-header :user_name="user_name" :twlink="twitter_link" :song_is_set="song_is_set"/>
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
        <router-view
          :date="date_str"
          :tables_is_set="tables_is_set"
          :filtered_score="filtered_score"
          :sorted_song_list="sorted_song_list"
          :recent_song_list="recent_song_list"
          :table_list="table_list"
          :level_list="level_list"
          :rival_id="rival_id"
          :selected_table="selected_table"
          :selected_level="selected_level"
          :visible_all_level="visible_all_level"
          @setTable="set_table"
          @setLevel="set_level"
          @setVisibleAllLevelsFlag="set_visible_all_level"
          v-if="is_initialized"
        />
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </section>
</template>

<script>
import Tables from "../../models/difficultyTable"
import InputUserId from "./score_viewer/selector/InputUserId"
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader"
import DateSelector from "./score_viewer/selector/DateSelector"
import Api from "../../api"
import * as log from "loglevel"
import SongFilter from "../../models/songFilter"
import {useStore} from "vuex"
import {computed} from "vue"
import { DateFormatter } from "../../models/date_formatter"
import SongDetail from "../../models/song_detail"

export default {
  name: "ScoreViewer",
  components: {
    ScoreViewerHeader,
    InputUserId,
    DateSelector,
  },
  props: {
    user_id: { type: Number },
    mode: { type: String },
    rival_id: { type: Number },
  },
  data: () => ({
    tables: new Tables([]),
    selected_table: null,
    selected_level: "",
    songs: null,
    scores: null,
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    rival_name: "",
    message: "",
    loaded: {user_id: null, rival_id: null, date: ""},
  }),
  setup () {
    const store = useStore()
    return {
      accessToken: computed(() => store.getters.accessToken),
      filter: computed(() => store.getters.filter)
    }
  },
  async beforeMount() {
    log.debug(this.filter)
    this.$store.commit('setFilter', new SongFilter(this.filter))
    const t = await Api.fetch_tables(this.accessToken)
    this.init_table(t)
    const s = await Api.fetch_songs(this.accessToken)
    this.init_songs(s)
    await this.fetch_detail(this.$route.query)
  },
  computed: {
    table_list() {
      return this.tables ? this.tables.name_list() : []
    },
    level_list() {
      return this.selected_table ? this.selected_table.level_list : []
    },
    tables_is_set() {
      return !!this.tables
    },
    score_is_set() {
      return !!this.scores
    },
    song_is_set() {
      return !!this.songs
    },
    table_is_selected() {
      return !!this.selected_table
    },
    is_initialized() {
      return this.tables_is_set && this.song_is_set && this.score_is_set && this.table_is_selected
    },
    visible_all_level() {
      return this.filter.visible_all_levels
    },
    date_str() {
      return DateFormatter.format(this.date)
    },
    user_name() {
      return this.score_is_set ? this.scores.name : ""
    },
    table_name() {
      return this.selected_table ? this.selected_table.name : ""
    },
    twitter_link() {
      if (!this.score_is_set) {
        return ""
      }
      return (
        "https://twitter.com/intent/tweet?url=" +
        window.location.host +
        "/%23/view?user_id=" +
        this.scores.user_id
      )
    },
    filtered_score() {
      if (!this.is_initialized || !this.selected_table) {
        return [SongDetail.dummy()]
      }
      return this.selected_table.get_filtered_score(this.filter)
    },
    sorted_song_list() {
      let songs = this.filtered_score
      if (!this.filter.visible_all_levels) {
        songs = songs.filter((s) => s.level === this.selected_level)
      }
      const length = this.filter.max_length > 0 ? this.filter.max_length : songs.length
      return songs
        .sort((a, b) => {
          let valA = a.sort_key(this.filter.sort_key, this.level_list)
          let valB = b.sort_key(this.filter.sort_key, this.level_list)
          return valA === valB ? 0 : (valA < valB) ^ this.filter.sort_desc ? -1 : 1
        })
        .slice(0, length)
    },
    recent_song_list() {
      let songs = this.filtered_score
      return songs.sort((a, b) => {
        return a.updated_at === b.updated_at ? 0 : (a.updated_at < b.updated_at) ? 1 : -1
      }).slice(0, this.filter.max_length > 0 ? this.filter.max_length : songs.length)
    }
  },
  methods: {
    init_songs(songs) {
      this.songs = songs
      this.init_table_score()
    },
    init_table(tables) {
      this.tables = tables
      log.debug(this.tables, this.tables.first())
      this.selected_table = this.tables.first()
      this.selected_level = this.selected_table.level_list[0]
      this.init_table_score()
    },
    init_score(scores) {
      this.scores = scores
      this.init_table_score()
    },
    init_table_score() {
      if (!this.is_initialized) {
        return
      }
      this.tables.tables = this.tables.tables.map((table) => table.set_score(this.songs, this.scores))
    },
    set_table(table_name) {
      this.selected_table = this.tables ? this.tables.get_table(table_name) : this.selected_table
      this.init_table_score()
      if (this.selected_table) {
        this.selected_level = this.selected_table.level_list[0]
      }
    },
    set_level(level) {
      this.selected_level = level
    },
    set_visible_all_level(flag) { this.filter.visible_all_levels = flag },
    renew_with_rival_score(scores) {
      if (!this.is_initialized) {
        return
      }
      this.tables = this.tables.set_rival_score(scores)
      this.rival_name = scores.name
    },

    async refreshUserId(input_user_id) {
      let query = Object.assign({}, this.$route.query)
      query.user_id = input_user_id
      await this.$router.push({query: query})
    },

    async set_rival() {
      if (this.loaded.rival_id !== this.rival_id) {
        await Api.fetch_score(
            this.date_str,
            this.rival_id,
            this.$store.getters.accessToken
        ).then(s => {
          this.renew_with_rival_score(s)
        })
        this.loaded.rival_id = this.rival_id
      }
    },

    async fetch_detail() {
      log.debug(this.user_id)
      if (this.loaded.user_id !== this.user_id || this.loaded.date !== this.date_str) {
        log.debug("fetch!")
        this.message = "読込中..."
        await Api.fetch_score(
            this.date_str,
            this.user_id,
            this.$store.getters.accessToken
        ).then(s => {
          this.init_score(s)
          this.message = this.score_is_set ? "" : "読み込み失敗"
        })
        this.loaded.user_id = this.user_id
        this.loaded.date = this.date_str
      }
    },

    async set_date(date) {
      this.date = date
      await this.fetch_detail()
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
        await this.fetch_detail()
      }
    },
    '$route': {
      async handler() {
        await this.fetch_detail()
        await this.set_rival()
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