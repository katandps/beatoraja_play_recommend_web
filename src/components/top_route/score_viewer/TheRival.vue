<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import InputUserId from "./selector/InputUserId"
import config from "../../../const"
import RivalModal from "./modal/RivalModal"
import HeaderCell from "./cell/HeaderCell"
import DataCell from "./cell/DataCell"
import DateCell from "./cell/DateCell"
import FilterModal from "./modal/FilterModal"
import { computed, ref } from "@vue/reactivity"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"

const store = useStore()
const route = useRoute()
const router = useRouter()

// --- refs ---
const rival_modal = ref(null)
const filter_modal = ref(null)

// --- props ---
const props = defineProps({
  sorted_song_list: { require: true },
  tables_is_set: { type: Boolean, require: true },
  date: { type: String, require: true },
  table_list: { require: true },
  level_list: { required: true },
  can_level_select: { type: Boolean, required: false },
  rival_id: { type: Number }
})

// --- computed ---
const filter = computed(() => store.getters.filter)

// --- methods ---
const clear_type_class = (song) =>
  "table-line-" + config.LAMP_INDEX[song.clear_type]

const refresh_rival_id = async (rival_id) => {
  let query = Object.assign({}, route.query)
  query.rival_id = rival_id
  await router.push({ query: query })
}
const show_modal = (song) => rival_modal.value.show_modal(song, props.date)

const show_filter_modal = () => filter_modal.value.show_modal()
</script>

<template>
  <div id="recent">
    <div class="row">
      <input-user-id
        :user_id="rival_id"
        @refresh="refresh_rival_id"
        class="col-sm-5"
      />
      <display-songs-limiter class="col-sm-4" />
      <label class="col-sm-3 btn btn-secondary" @click="show_filter_modal"
        >表示曲設定</label
      >
    </div>
    <hr />
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col clear" v-if="filter.column_is_active('clear')" />
          <div class="col level" v-if="filter.column_is_active('level')" />
          <div class="col title" v-if="filter.column_is_active('title')" />
          <div class="col date" v-if="filter.column_is_active('date')" />
          <div
            class="col clear_vs"
            v-if="filter.column_is_active('clear_diff_rival')"
          />
          <div
            class="col score_vs"
            v-if="filter.column_is_active('score_diff_rival')"
          />
          <div
            class="col bp_vs"
            v-if="filter.column_is_active('bp_diff_rival')"
          />
          <div class="col date" v-if="filter.column_is_active('rival_date')" />
        </div>

        <div class="thead">
          <div class="tr">
            <header-cell class="clear" column_name="clear" />
            <header-cell class="level" column_name="level">Lv</header-cell>
            <header-cell class="title" column_name="title">Title</header-cell>
            <header-cell class="date" column_name="date">Date</header-cell>
            <header-cell class="clear_vs" column_name="clear_diff_rival"
              >ClearVS</header-cell
            >
            <header-cell class="score_vs" column_name="score_diff_rival"
              >ScoreVS</header-cell
            >
            <header-cell class="bp_vs" column_name="bp_diff_rival"
              >BPVS</header-cell
            >
            <header-cell class="date" column_name="rival_date"
              >RivalDate</header-cell
            >
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div
            v-for="song in sorted_song_list"
            :key="song.md5"
            :class="clear_type_class(song)"
            class="tr"
          >
            <data-cell
              class="clear"
              column_name="clear"
              :class="song.clear_type_bg_class()"
            />
            <data-cell class="level" column_name="level">{{
              song.level
            }}</data-cell>
            <data-cell
              class="title"
              column_name="title"
              @click="show_modal(song)"
            >
              {{ song.title }}
            </data-cell>
            <date-cell column_name="date" :date="song.updated_at" />
            <data-cell
              class="clear_vs"
              column_name="clear_diff_rival"
              :class="song.clear_type_rival_bg_class()"
            >
              <span
                v-if="song.clear_type === song.rival_clear_type"
                class="draw"
                >draw</span
              >
              <span
                v-else-if="song.clear_type < song.rival_clear_type"
                class="lose"
                >lose</span
              >
              <span v-else class="win">win</span>
            </data-cell>
            <data-cell class="score_vs" column_name="score_diff_rival">
              <span v-if="song.score === 0 || song.rival_score === 0">-</span>
              <span v-else-if="song.score === song.rival_score" class="draw">{{
                song.score - song.rival_score
              }}</span>
              <span v-else-if="song.score < song.rival_score" class="lose">{{
                song.score - song.rival_score
              }}</span>
              <span v-else class="win"
                >+{{ song.score - song.rival_score }}</span
              >
            </data-cell>
            <data-cell class="bp_vs" column_name="bp_diff_rival">
              <span
                v-if="
                  song.rival_min_bp === -1 ||
                  song.min_bp === -1 ||
                  song.rival_min_bp === 2147483647 ||
                  song.min_bp === 2147483647
                "
                >---</span
              >
              <span
                v-else-if="song.rival_min_bp === song.min_bp"
                class="draw"
                >{{ song.min_bp - song.rival_min_bp }}</span
              >
              <span v-else-if="song.rival_min_bp < song.min_bp" class="lose"
                >+{{ song.min_bp - song.rival_min_bp }}</span
              >
              <span v-else class="win">{{
                song.min_bp - song.rival_min_bp
              }}</span>
            </data-cell>
            <date-cell column_name="rival_date" :date="song.rival_updated_at" />
          </div>
        </transition-group>
      </div>
    </div>
    <rival-modal ref="rival_modal" />
    <filter-modal ref="filter_modal" />
  </div>
</template>
