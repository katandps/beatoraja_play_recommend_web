<script setup lang="ts">
import Tables, { CheckedTables } from "../../models/difficultyTable"
import Api from "../../api"
import { debug } from "loglevel"
import { computed, onMounted, ref } from "vue"
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
import { useFilterStore } from "@/store/filter"
import { useLoginStore } from "@/store/session"

const sessionStore = useLoginStore()
const filterStore = useFilterStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  Api.fetch_tables(sessionStore.accessToken).then((t) => (tables.value = t))
  Api.fetch_songs(sessionStore.accessToken).then((s) => (songs.value = s))
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
const songs = ref()
const scores = ref()
const rival_score = ref()
const date = ref(new Date())
const rival_date = ref(new Date())
const message = ref("")
const loaded = ref({ user_id: 0, rival_id: 0, date: "" })

// --- computed ---
const level_list = computed(() => tables.value.level_list())
const exists_tables = computed(() => !!tables.value)
const exists_scores = computed(() => !!scores.value)
const exists_songs = computed(() => !!songs.value)
const exists_rival_score = computed(() => !!rival_score.value)
const is_initialized = computed(
  () => exists_tables.value && exists_songs.value && exists_scores.value
)
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

const level_is_empty = computed(() => CheckedTables.is_empty(filterStore.checked_tables, tables.value));

const filtered_score = computed(() => {
  if (!is_initialized.value) {
    return []
  }
  let ret = []
  let used: { [key: string]: boolean } = {}
  for (let table_index = 0; table_index < tables.value.tables.length; table_index += 1) {
    const table = tables.value.tables[table_index]
    for (const level in table.levels) {
      if (!CheckedTables.is_checked(filterStore.checked_tables, table_index, level)) {
        continue;
      }
      const hashes = table.levels[level]
      if (!hashes) {
        continue
      }

      for (const hash of hashes) {
        if (used[hash]) {
          continue
        }
        used[hash] = true
        let score = new SongDetail()
        score.set_level(level)
        score.init_score(scores.value.get_score(hash))
        score.init_song(songs.value.get_score(hash), hash)
        if (exists_rival_score.value) {
          score.init_rival_score(rival_score.value?.get_score(hash))
        }
        if (filterStore.filter.apply(score, exists_rival_score.value)) {
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
    .sort((a, b) =>
      SongDetail.cmp(
        a,
        b,
        filterStore.filter.sort_key,
        filterStore.filter.sort_desc,
        level_list.value
      )
    )
    .slice(0, filterStore.filter.max_length || songs.length)
})

// --- methods ---
const setRival = (rival_id: number) => {
  debug(loaded.value, rival_id)
  if (rival_id > 0 && loaded.value.rival_id !== rival_id) {
    Api.fetch_score(rival_date.value, rival_id, sessionStore.accessToken).then(
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
const setLevel = (levels: string[], index: number) => {
  filterStore.checked_tables.tables[index].checks = levels
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
    Api.fetch_score(date.value, user_id, sessionStore.accessToken).then((s) => {
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

// watch(filter, (cur) => store.commit("setFilter", cur))
</script>

<template>
  <section id="score-table">
    <div class="row">
      <div class="col-sm-3 btn btn-secondary" @click="showUserModal">
        プレイヤー選択
      </div>
      <div class="col-sm-3 btn btn-secondary" @click="showFilterModal">
        表示曲設定
      </div>
      <div v-if="level_is_empty" class="col-sm-3 btn btn-danger" @click="showTablesModal">
        難易度選択(未)
      </div>
      <div v-else class="col-sm-3 btn btn-secondary" @click="showTablesModal">
        難易度選択
      </div>
      <div class="col-sm-3 btn btn-secondary" @click="showRivalModal">
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
          <TheDetailVue :sorted_song_list="sorted_song_list" :user_id="user_id" :date="date_str"
            :filter="filterStore.filter" />
        </template>
        <template v-if="mode === 'lamp'">
          <LampGraphVue :filtered_score="filtered_score" :tables="tables" :checks="filterStore.checked_tables" />
        </template>

        <template v-if="mode === 'rank'">
          <RankGraphVue :filtered_score="filtered_score" :tables="tables" :checks="filterStore.checked_tables" />
        </template>

        <template v-if="mode === 'stat'">
          <TheStatVue :filtered_score="filtered_score" />
        </template>
      </div>
    </div>
    <p v-else>{{ message }}</p>
    <ModalUserSelect ref="user_modal" :user_id="user_id" @setUser="setUserId" />
    <ModalForSelectTable ref="tables_modal" :tables="tables" :checks="filterStore.checked_tables" @setLevel="setLevel"
      v-if="exists_tables" />
    <ModalUserSelect ref="rival_modal" :user_id="rival_id" @setUser="setRivalId" :rival_mode="true" />
    <FilterModal ref="filter_modal" :rival_mode="exists_rival_score" />
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
