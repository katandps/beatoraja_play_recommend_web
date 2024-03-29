<script setup lang="ts">
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"
import config from "../../../../const"
import { computed, ref } from "vue"
import { useFilterStore } from "@/store/filter"
export interface IFilterModal {
  showModal: () => void
}

const filterStore = useFilterStore()

// --- ref ---
const modal_base = ref<IModalBase>()

// --- props ---
interface Props {
  rival_mode: Boolean
}
const props = defineProps<Props>()

// --- computed ---
const filter = computed(() => filterStore.filter)
const rival_mode = computed(() => props.rival_mode)

// --- methods ---
const showModal = () => modal_base.value?.showModal()

// --- expose ---
defineExpose({ showModal })
</script>
<template>
  <ModalBaseVue id="filter-modal" ref="modal_base">
    <template v-slot:header>
      <h2>譜面フィルター設定</h2>
    </template>
    <template v-slot:body>
      <div id="song_filter">
        <div class="filter">
          <h5>クリアタイプ</h5>
          <div>
            <div v-for="lamp in config.LAMP_GRAPH_LIST" :key="lamp" class="btn">
              <input type="checkbox" :id="'' + lamp" :value="lamp" v-model="filter.visible_lamp.lamps[lamp]" />
              <label :for="'' + lamp">{{ config.LAMP_INDEX[lamp] }}</label>
            </div>
          </div>
          <button class="btn btn-danger" @click="filter.visible_reverse()">
            表示反転
          </button>
          <button class="btn btn-success" @click="filter.visible_all_lamp_type()">
            全表示
          </button>
          <button class="btn btn-success" @click="filter.visible_not_full_combo()">
            未FC
          </button>
          <button class="btn btn-success" @click="filter.visible_not_ex_hard()">
            未EXH
          </button>
          <button class="btn btn-success" @click="filter.visible_not_hard()">
            未HARD
          </button>
          <button class="btn btn-success" @click="filter.visible_not_easy()">
            未EASY
          </button>
        </div>
        <hr />

        <div class="filter">
          <h5>スコアランク</h5>
          <div>
            <div v-for="rank in config.RANK_TYPE" :key="rank" class="btn">
              <input type="checkbox" :id="rank" :value="rank" v-model="filter.visible_rank.ranks[rank]" />
              <label :for="rank">{{ rank }}</label>
            </div>
          </div>
        </div>
        <hr />

        <div class="filter">
          <h5>更新日時</h5>
          <button class="btn btn-success" @click="filter.filter_all_term()">
            全期間
          </button>
          <button class="btn btn-success" @click="filter.filter_older_half_year()">
            半年以上更新なし
          </button>
          <button class="btn btn-success" @click="filter.filter_older_one_year()">
            1年以上更新なし
          </button>
          <button class="btn btn-success" @click="filter.filter_older_two_year()">
            2年以上更新なし
          </button>
        </div>
        <hr />
        <div class="filter">
          <h5>ライバル勝敗{{ !rival_mode ? "(ライバル未設定)" : "" }}</h5>
          <div>
            <div class="btn">
              <input type="checkbox" id="rival_score_win" v-model="filter.rival_vs.types.scoreWin"
                :disabled="!rival_mode" />
              <label for="rival_score_win">スコア勝利</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_score_draw" v-model="filter.rival_vs.types.scoreDraw"
                :disabled="!rival_mode" />
              <label for="rival_score_draw">スコア引き分け</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_score_lose" v-model="filter.rival_vs.types.scoreLose"
                :disabled="!rival_mode" />
              <label for="rival_score_lose">スコア敗北</label>
            </div>
          </div>
          <div>
            <div class="btn">
              <input type="checkbox" id="rival_bp_win" v-model="filter.rival_vs.types.bpWin" :disabled="!rival_mode" />
              <label for="rival_bp_win">ミスカウント勝利</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_bp_draw" v-model="filter.rival_vs.types.bpDraw" :disabled="!rival_mode" />
              <label for="rival_bp_draw">ミスカウント引き分け</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_bp_lose" v-model="filter.rival_vs.types.bpLose" :disabled="!rival_mode" />
              <label for="rival_bp_lose">ミスカウント敗北</label>
            </div>
          </div>
          <div>
            <div class="btn">
              <input type="checkbox" id="rival_clear_win" v-model="filter.rival_vs.types.clearWin"
                :disabled="!rival_mode" />
              <label for="rival_clear_win">クリア勝利</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_clear_draw" v-model="filter.rival_vs.types.clearDraw"
                :disabled="!rival_mode" />
              <label for="rival_clear_draw">クリア引き分け</label>
            </div>
            <div class="btn">
              <input type="checkbox" id="rival_clear_lose" v-model="filter.rival_vs.types.clearLose"
                :disabled="!rival_mode" />
              <label for="rival_clear_lose">クリア敗北</label>
            </div>
          </div>
        </div>
        <hr />
        <div class="filter">
          <h5>ライバルのクリアタイプ{{ !rival_mode ? "(ライバル未設定)" : "" }}</h5>
          <div>
            <div v-for="lamp in config.LAMP_GRAPH_LIST" :key="lamp" class="btn">
              <input type="checkbox" :id="'rival' + lamp" :value="lamp" v-model="filter.rival_lamp.lamps[lamp]"
                :disabled="!rival_mode" />
              <label :for="'rival' + lamp">{{ config.LAMP_INDEX[lamp] }}</label>
            </div>
          </div>
        </div>
        <hr />
        <div class="filter">
          <h5>ライバルのスコアランク{{ !rival_mode ? "(ライバル未設定)" : "" }}</h5>
          <div>
            <div v-for="rank in config.RANK_TYPE" :key="rank" class="btn">
              <input type="checkbox" :id="'rival' + rank" :value="rank" v-model="filter.rival_rank.ranks[rank]"
                :disabled="!rival_mode" />
              <label :for="'rival' + rank">{{ rank }}</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalBaseVue>
</template>

<style scoped>
.filter button {
  margin: 5px;
  display: inline;
}
</style>
