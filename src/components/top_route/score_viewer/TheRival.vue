<script setup>
import DisplaySongsLimiter from "./selector/DisplaySongsLimiter"
import InputUserId from "./selector/InputUserId"
import RivalModal from "./modal/RivalModal"
import FilterModal from "./modal/FilterModal"
import { computed, ref } from "@vue/reactivity"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import RowSong from "./cell/RowSong"
import RowHeader from "./cell/RowHeader.vue"
import RowColGroup from "./cell/RowColGroup.vue"

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
const columns = computed(() => store.getters.filter.columns_rival)

// --- methods ---
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
        <RowColGroup :columns="columns" />
        <RowHeader :columns="columns" />
        <transition-group tag="div" class="tbody" name="flip-list">
          <RowSong
            v-for="song in sorted_song_list"
            :key="song.md5"
            :song="song"
            :columns="columns"
            @showModal="show_modal"
          />
        </transition-group>
      </div>
    </div>
    <rival-modal ref="rival_modal" />
    <filter-modal ref="filter_modal" />
  </div>
</template>
