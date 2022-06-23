<script setup lang="ts">
import SongFilter from "@/models/songFilter"
import { computed, ref } from "vue"
import { useStore } from "vuex"
import ModalBaseVue, { IModalBase } from "./ModalBase.vue"

export interface IRecommendModal {
  showModal: () => void
}

const store = useStore()

const modal_base = ref<IModalBase>()

// --- computed ---
const filter = computed<SongFilter>(() => store.getters.filter)

// --- methods ---
const showModal = () => modal_base.value?.showModal()

// --- expose ---
defineExpose({ showModal })
</script>
<template>
  <ModalBaseVue id="recommend-modal" ref="modal_base">
    <template v-slot:header>
      <h2>おすすめ設定</h2>
    </template>
    <template v-slot:body>
      <div class="filter">
        <h2>目標から選ぶ</h2>
        <h3>更新狙い</h3>
        <button class="btn btn-success" @click="filter.for_score()">
          スコア更新狙い
        </button>
        <button class="btn btn-success" @click="filter.for_bp()">
          BP更新狙い
        </button>

        <h3>スコアランク狙い</h3>
        <button class="btn btn-success" @click="filter.for_aaa()">
          AAA狙い
        </button>
        <button class="btn btn-success" @click="filter.for_aa()">AA狙い</button>

        <h3>クリアランプ狙い</h3>
        <button class="btn btn-success" @click="filter.for_easy()">
          Easy狙い
        </button>
        <button class="btn btn-success" @click="filter.for_hard()">
          Hard狙い
        </button>
        <button class="btn btn-success" @click="filter.for_ex_hard()">
          EXH狙い
        </button>
        <button class="btn btn-success" @click="filter.for_full_combo()">
          FC狙い
        </button>

        <h3>ランダムセレクト</h3>
        <button class="btn btn-primary" @click="filter.for_random()">
          ランダムセレクト
        </button>
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
