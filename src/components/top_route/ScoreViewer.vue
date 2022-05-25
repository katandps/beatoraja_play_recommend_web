<script setup lang="ts">
import Tables from "../../models/difficultyTable"
import Api from "../../api"
import { debug } from "loglevel"
import SongFilter from "../../models/songFilter"
import { useStore } from "vuex"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { DateFormatter } from "../../models/date_formatter"
import SongDetail from "../../models/song_detail"
import ModalForSelectTable, {
  IModalForSelectTable
} from "./score_viewer/modal/ModalForSelectTable.vue"
import ModalUserSelect, {
  IModalUserSelect
} from "./score_viewer/modal/ModalUserSelect.vue"
import FilterModal, { IFilterModal } from "./score_viewer/modal/FilterModal.vue"
import LampGraphVue from "./score_viewer/LampGraph.vue"
import RankGraphVue from "./score_viewer/RankGraph.vue"
import TheDetailVue from "./score_viewer/TheDetail.vue"
import TheStatVue from "./score_viewer/TheStat.vue"
const store = useStore()
const route = useRoute()
const router = useRouter()
onMounted(() => {
  store.commit("setFilter", new SongFilter(filter.value))
  Api.fetch_tables(accessToken.value).then((t) => init_table(t))
  Api.fetch_songs(accessToken.value).then((s) => (songs.value = s))
  fetchDetail(props.user_id)
  setRival(props.rival_id)
})

// --- refs ---
const tables_modal = ref<IModalForSelectTable>()
const user_modal = ref<IModalUserSelect>()
const filter_modal = ref<IFilterModal>()
const rival_modal = ref<IModalUserSelect>()

// --- props ---
interface Props {
  user_id: number
  mode: string
  rival_id: number
}
const props = defineProps<Props>()

// --- data ---
const tables = ref(new Tables([]))
const selected_table = ref()
const selected_level = ref("")
const songs = ref()
const scores = ref()
const rival_score = ref()
const date = ref(new Date(new Date().setHours(0, 0, 0, 0)))
const rival_date = ref(new Date(new Date().setHours(0, 0, 0, 0)))
const message = ref("")
const loaded = ref({ user_id: 0, rival_id: 0, date: "" })

// --- computed ---
const accessToken = computed<string>(() => store.getters.accessToken)
const filter = computed(() => store.getters.filter)

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
const date_str = computed(() => DateFormatter.format(date.value))
const rival_date_str = computed(() => DateFormatter.format(rival_date.value))

const user_name = computed(() => (exists_scores.value ? scores.value.name : ""))
const twitter_link = computed(() =>
  exists_scores.value
    ? "https://twitter.com/intent/tweet?url=" +
      window.location.host +
      "/%23/view?user_id=" +
      scores.value.user_id
    : ""
)

const filtered_score = computed(() => {
  if (!is_initialized.value) {
    return []
  }
  let ret = []
  let used: { [key: string]: boolean } = {}
  for (const table of tables.value.tables) {
    for (const active_level of table.checks) {
      const hashes = table.levels[active_level]
      for (const hash of hashes) {
        if (used[hash]) {
          continue
        }
        used[hash] = true
        let score = new SongDetail()
        score.set_level(active_level)
        score.init_score(scores.value.get_score(hash))
        score.init_song(songs.value.get_score(hash), hash)
        if (exists_rival_score.value) {
          score.init_rival_score(rival_score.value.get_score(hash))
        }
        if (filter.value.apply(score)) {
          ret.push(score)
        }
      }
    }
  }
  return ret
})

const sorted_song_list = computed(() => {
  let songs = filtered_score.value
  return songs
    .sort((a, b) => {
      let valA = a.sort_key(filter.value.sort_key, level_list.value)
      let valB = b.sort_key(filter.value.sort_key, level_list.value)
      return valA === valB ? 0 : (valA < valB) ^ filter.value.sort_desc ? -1 : 1
    })
    .slice(0, filter.value.max_length || songs.length)
})

// --- methods ---
const init_table = (t: Tables) => {
  tables.value = t
  debug(tables, tables.value.first())
  selected_table.value = tables.value.first()
  selected_level.value = selected_table.value.level_list[0]
}

const setRival = (rival_id: number) => {
  debug(loaded.value, rival_id)
  if (rival_id > 0 && loaded.value.rival_id !== rival_id) {
    Api.fetch_score(rival_date_str.value, rival_id, accessToken.value).then(
      (s) => {
        rival_score.value = null
        rival_score.value = s
        loaded.value.rival_id = rival_id
      }
    )
  } else {
    rival_score.value = null
    loaded.value.rival_id = 0
  }
}

const fetchDetail = (user_id: number) => {
  debug(props.user_id)
  if (!user_id) {
    message.value = "プレイヤーを選択してください"
    return
  }
  if (
    loaded.value.user_id !== user_id ||
    loaded.value.date !== date_str.value
  ) {
    debug("fetch!")
    message.value = "読込中..."
    Api.fetch_score(date_str.value, user_id, accessToken.value).then((s) => {
      scores.value = s
      message.value = exists_scores.value ? "" : "読み込み失敗"
      loaded.value.user_id = user_id
      loaded.value.date = date_str.value
    })
  }
}

const showTablesModal = () => tables_modal.value?.showModal()
const showUserModal = () => user_modal.value?.showModal()
const setUserId = async (input_user_id: number, d: Date) => {
  user_modal.value?.closeModal()
  let query = Object.assign({}, route.query)
  query.user_id = "" + input_user_id
  date.value = d
  debug(query)
  await router.push({ query })
  fetchDetail(input_user_id)
}
const showFilterModal = () => filter_modal.value?.showModal()
const showRivalModal = () => rival_modal.value?.showModal()
const setRivalId = async (input_rival_id: number, d: Date) => {
  rival_modal.value?.closeModal()
  let query = Object.assign({}, route.query)
  query.rival_id = "" + input_rival_id
  rival_date.value = d
  debug(query)
  await router.push({ query })
  setRival(input_rival_id)
}

watch(filter, (cur) => store.commit("setFilter", cur))
</script>

<template>
  <section id="score-table">
    <div class="row">
      <div class="col-sm-3 btn btn-info" @click="showUserModal">
        表示プレイヤー選択
      </div>
      <div class="col-sm-3 btn btn-secondary" @click="showFilterModal">
        表示曲設定
      </div>
      <div class="col-sm-3 btn btn-info" @click="showTablesModal">
        難易度表設定
      </div>
      <div class="col-sm-3 btn btn-info" @click="showRivalModal">
        ライバル選択
      </div>
    </div>
    <hr />
    <div v-if="is_initialized">
      <div>
        <h2>
          {{ user_name }}のデータ
          <a :href="twitter_link" target="_blank">
            <font-awesome-icon :icon="['fab', 'twitter-square']" />
          </a>
        </h2>
        <h3 v-if="exists_rival_score">ライバル表示: {{ rival_score.name }}</h3>
      </div>
      <div>
        <div class="form-group row">
          <div class="col-sm-12">
            <router-link :to="{ path: '/view/lamp', query: route.query }">
              <div class="btn btn-outline-secondary col-sm-3 text-nowrap">
                クリアランプ
              </div>
            </router-link>
            <router-link :to="{ path: '/view/rank', query: route.query }">
              <div class="btn btn-outline-secondary col-sm-3 text-nowrap">
                スコアランク
              </div>
            </router-link>
            <router-link :to="{ path: '/view/stat', query: route.query }">
              <div class="btn btn-outline-secondary col-sm-3 text-nowrap">
                統計
                <font-awesome-icon :icon="['fas', 'wrench']" />
              </div>
            </router-link>
            <router-link :to="{ path: '/view/', query: route.query }">
              <div class="btn btn-outline-secondary col-sm-3 text-nowrap">
                リスト表示
              </div>
            </router-link>
          </div>
        </div>

        <hr />
        <template v-if="mode === 'detail'">
          <TheDetailVue
            :sorted_song_list="sorted_song_list"
            :date="date_str"
            :filter="filter"
          />
        </template>
        <template v-if="mode === 'lamp'">
          <LampGraphVue :filtered_score="filtered_score" :tables="tables" />
        </template>

        <template v-if="mode === 'rank'">
          <RankGraphVue :filtered_score="filtered_score" :tables="tables" />
        </template>

        <template v-if="mode === 'stat'">
          <TheStatVue :filtered_score="filtered_score" />
        </template>
      </div>
    </div>
    <p v-else>{{ message }}</p>
    <ModalUserSelect ref="user_modal" :user_id="user_id" @setUser="setUserId" />
    <ModalForSelectTable
      :tables="tables"
      v-if="is_initialized"
      ref="tables_modal"
    />
    <ModalUserSelect
      ref="rival_modal"
      :user_id="rival_id"
      @setUser="setRivalId"
      :rival_mode="true"
    />
    <FilterModal ref="filter_modal" />
  </section>
</template>

<style scoped>
#score-table {
  padding-top: 20px;
}
.row {
  margin-left: 0;
  margin-right: 0;
}
</style>
