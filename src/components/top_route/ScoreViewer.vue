<script setup lagn="ts">
import Tables from "../../models/difficultyTable"
import InputUserId from "./score_viewer/selector/InputUserId"
import ScoreViewerHeader from "./score_viewer/ScoreViewerHeader"
import DateSelector from "./score_viewer/selector/DateSelector"
import Api from "../../api"
import { debug } from "loglevel"
import SongFilter from "../../models/songFilter"
import { useStore } from "vuex"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { DateFormatter } from "../../models/date_formatter"
import SongDetail from "../../models/song_detail.ts"
import ModalForSelectTable from "./score_viewer/modal/ModalForSelectTable"

const store = useStore()
const route = useRoute()
const router = useRouter()
onMounted(() => {
  store.commit("setFilter", new SongFilter(filter.value))
  Api.fetch_tables(accessToken).then((t) => init_table(t))
  Api.fetch_songs(accessToken).then((s) => (songs.value = s))
  fetchDetail(route.query)
  setRival(props.rival_id)
})

// --- refs ---
const tables_modal = ref(null)

// --- props ---
const props = defineProps({
  user_id: { type: Number },
  mode: { type: String },
  rival_id: { type: Number }
})

// --- data ---
const tables = ref(new Tables([]))
const selected_table = ref()
const selected_level = ref("")
const songs = ref()
const scores = ref()
const rival_score = ref()
const date = ref(new Date(new Date().setHours(0, 0, 0, 0)))
const message = ref("")
const loaded = ref({ user_id: null, rival_id: null, date: "" })

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)
const filter = computed(() => store.getters.filter)
const table_list = computed(() =>
  tables.value ? tables.value.name_list() : []
)
const level_list = computed(() =>
  selected_table.value ? selected_table.value.level_list : []
)
const exists_tables = computed(() => !!tables.value)
const exists_scores = computed(() => !!scores.value)
const exists_songs = computed(() => !!songs.value)
const exists_table_selected = computed(() => !!selected_table.value)
const exists_rival_score = computed(() => !!rival_score.value)
const is_initialized = computed(
  () =>
    exists_tables.value &&
    exists_songs.value &&
    exists_scores.value &&
    exists_table_selected.value
)
const visible_all_level = computed(() => filter.value.visible_all_levels)
const date_str = computed(() => DateFormatter.format(date.value))
const user_name = computed(() => (exists_scores.value ? scores.value.name : ""))
const twitter_link = computed(() =>
  exists_scores.value
    ? "https://twitter.com/intent/tweet?url=" +
      window.location.host +
      "/%23/view?user_id=" +
      scores.value.user_id
    : ""
)
const table_score = computed(() => {
  if (!is_initialized.value) {
    return {}
  }
  debug(selected_table.value.levels)
  let table_score = {}
  Object.entries(selected_table.value.levels).forEach(([level_label, hashes]) =>
    hashes.forEach((hash) => {
      if (!table_score[level_label]) {
        table_score[level_label] = {}
      }
      if (!table_score[level_label][hash]) {
        table_score[level_label][hash] = new SongDetail()
      }
      table_score[level_label][hash].init_score(scores.value.get_score(hash))
      table_score[level_label][hash].init_song(
        songs.value.get_score(hash),
        hash
      )
      if (exists_rival_score.value) {
        table_score[level_label][hash].init_rival_score(
          rival_score.value.get_score(hash)
        )
      }
      table_score[level_label][hash].set_level(level_label)
    })
  )

  debug(table_score)
  return table_score
})

const filtered_score = computed(() =>
  Object.values(table_score.value)
    .map((scores) => Object.values(scores).filter((s) => filter.value.apply(s)))
    .flat()
)
const sorted_song_list = computed(() => {
  let songs = filtered_score.value
  if (!filter.value.visible_all_levels) {
    songs = songs.filter((s) => s.level === selected_level.value)
  }
  return songs
    .sort((a, b) => {
      let valA = a.sort_key(filter.value.sort_key, level_list)
      let valB = b.sort_key(filter.value.sort_key, level_list)
      return valA === valB ? 0 : (valA < valB) ^ filter.value.sort_desc ? -1 : 1
    })
    .slice(0, filter.value.max_length || songs.length)
})
const recent_song_list = computed(() =>
  filtered_score.value
    .slice()
    .sort((a, b) =>
      a.updated_at === b.updated_at ? 0 : a.updated_at < b.updated_at ? 1 : -1
    )
    .slice(0, filter.value.max_length || filtered_score.value.length)
)

// --- methods ---
const init_table = (t) => {
  tables.value = t
  debug(tables, tables.value.first())
  selected_table.value = tables.value.first()
  selected_level.value = selected_table.value.level_list[0]
}

const setRival = (rival_id) => {
  debug(loaded.value, rival_id)
  if (loaded.value.rival_id !== rival_id) {
    Api.fetch_score(date_str.value, rival_id, accessToken).then((s) => {
      rival_score.value = s
    })
  }
  loaded.value.rival_id = rival_id
}

const fetchDetail = () => {
  debug(props.user_id)
  if (
    loaded.value.user_id !== props.user_id ||
    loaded.value.date !== date_str.value
  ) {
    debug("fetch!")
    message.value = "読込中..."
    Api.fetch_score(date_str.value, props.user_id, accessToken).then((s) => {
      scores.value = s
      message.value = exists_scores.value ? "" : "読み込み失敗"
    })
    loaded.value.user_id = props.user_id
    loaded.value.date = date_str.value
  }
}
const refreshUserId = async (input_user_id) => {
  let query = Object.assign({}, route.query)
  query.user_id = input_user_id
  debug(query)
  await router.push({ query: query })
  fetchDetail()
}
const set_table = (table_name) => {
  selected_table.value = tables.value
    ? tables.value.get_table(table_name)
    : selected_table.value
  if (exists_table_selected.value) {
    selected_level.value = selected_table.value.level_list[0]
  }
}
const set_level = (level) => (selected_level.value = level)
const set_visible_all_level = (flag) => (filter.value.visible_all_levels = flag)

const set_date = (d) => {
  date.value = d
  this.fetchDetail()
}
const show_modal = () => tables_modal.value.show_modal()
</script>

<style scoped>
#score-table {
  padding-top: 20px;
}
</style>

<template>
  <section id="score-table">
    <div class="row">
      <InputUserId
        :user_id="user_id"
        @refresh="refreshUserId"
        class="col-sm-4"
      />
      <DateSelector :date="date" @setDate="set_date" class="col-sm-4" />
      <div class="col-sm-4">
        <div class="btn btn-info" @click="show_modal">難易度表設定</div>
      </div>
    </div>
    <hr />
    <div v-if="is_initialized">
      <score-viewer-header
        :user_name="user_name"
        :twlink="twitter_link"
        :exists_songs="exists_songs"
      />
      <div>
        <div class="form-group row">
          <div class="col-sm-12">
            <router-link :to="{ path: '/view/lamp', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                クリアランプ
              </div>
            </router-link>
            <router-link :to="{ path: '/view/rank', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                スコアランク
              </div>
            </router-link>
            <router-link :to="{ path: '/view/stat', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                統計
                <font-awesome-icon :icon="['fas', 'wrench']" />
              </div>
            </router-link>
            <router-link :to="{ path: '/view/', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                詳細
              </div>
            </router-link>
            <router-link :to="{ path: '/view/recent', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                最近更新
              </div>
            </router-link>
            <router-link :to="{ path: '/view/rival', query: $route.query }">
              <div class="btn btn-outline-secondary col-sm-2 text-nowrap">
                ライバル比較
              </div>
            </router-link>
          </div>
        </div>

        <hr />
        <router-view
          :date="date_str"
          :exists_tables="exists_tables"
          :filtered_score="filtered_score"
          :sorted_song_list="sorted_song_list"
          :recent_song_list="recent_song_list"
          :table_list="table_list"
          :level_list="level_list"
          :rival_id="rival_id"
          @setRival="setRival"
          v-if="is_initialized"
        />
        <ModalForSelectTable
          :can_level_select="true"
          :table_list="table_list"
          :level_list="level_list"
          :selected_table="selected_table"
          :selected_level="selected_level"
          :visible_all_level="visible_all_level"
          @setTable="set_table"
          @setLevel="set_level"
          @setVisibleAllLevelsFlag="set_visible_all_level"
          v-if="is_initialized"
          ref="tables_modal"
        />
      </div>
    </div>
    <p v-else>{{ message }}</p>
  </section>
</template>
