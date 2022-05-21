<script setup lang="ts">
import ModalBase from "./ModalBase"
import Columns from "../../../../models/columns"
import { useStore } from "vuex"
import { ref, computed } from "vue"

const store = useStore()

// --- ref ---
const modal_base = ref(null)

// --- props ---
const props = defineProps({
  columns: { type: Columns, require: true }
})

// --- computed ---
const columns = computed({
  get: () => props.columns,
  set: (columns) => store.commit("setColumns", this.columns)
})
const column_list = computed(() =>
  DETAIL_COLUMNS.filter((c) => c.key !== "title")
)

// --- methods ---
const show_modal = () => modal_base.value.show_modal()

// --- expose ---
defineExpose({ show_modal })
</script>

<template>
  <modal-base id="column-modal" ref="modal_base">
    <template v-slot:header>
      <h2>表示カラム設定</h2>
    </template>
    <template v-slot:body>
      <div id="detail-columns" class="form-group row align-items-center">
        <div
          v-for="obj in column_list"
          :key="obj.key"
          class="form-control col-sm-3 text-nowrap"
        >
          <label style="font-size: 0.9rem">
            <input
              type="checkbox"
              :id="obj.key"
              v-model="columns.columns[obj.key]"
            />
            {{ obj.name }}
          </label>
        </div>
      </div>
    </template>
  </modal-base>
</template>

<script lang="ts">
const DETAIL_COLUMNS = [
  { key: "clear", name: "クリア", title: " ", class: "clear" },
  {
    key: "clear_date",
    name: "クリア更新日",
    title: "Date(clear)",
    class: "date"
  },
  { key: "clear_before", name: "更新前クリア", title: " ", class: "clear" },
  { key: "level", name: "難易度", title: "Lv", class: "level" },
  { key: "title", name: "曲名", title: "Title", class: "title" },
  { key: "score_rank", name: "スコアランク", title: "Rank", class: "rank" },
  { key: "detail_rank", name: "細分化ランク", title: "Rank", class: "rank" },
  { key: "rate", name: "スコア%", title: "Rate", class: "rate" },
  { key: "score", name: "EXスコア", title: "Ex/Max", class: "score" },
  {
    key: "score_date",
    name: "スコア更新日",
    title: "Date(score)",
    class: "date"
  },
  {
    key: "score_before",
    name: "更新前スコア",
    title: "Ex(old)",
    class: "score"
  },
  { key: "bp", name: "ミスカウント", title: "BP", class: "bp" },
  {
    key: "bp_date",
    name: "ミスカウント更新日",
    title: "Date(BP)",
    class: "date"
  },
  {
    key: "bp_before",
    name: "更新前ミスカウント",
    title: "BP(old)",
    class: "bp"
  },
  { key: "combo", name: "最高コンボ", title: "Combo", class: "combo" },
  { key: "play", name: "プレイ回数", title: "Play", class: "play" },
  { key: "date", name: "更新日", title: "Date", class: "date" }
]
</script>
