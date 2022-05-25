<script setup>
import { computed, ref } from "vue"
import { useStore } from "vuex"
import Api from "../../api"
import PlayStats from "../../models/playStats.ts"

const store = useStore()

const props = defineProps({
  user_id: { type: Number, require: true }
})

// --- data ---
const history = ref(PlayStats.default())

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)

Api.fetch_play_stats(accessToken, props.user_id).then(
  (h) => (history.value = h)
)
</script>

<template>
  <section id="history-page">
    <h2>プレイ履歴</h2>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="thead" style="background-color: #ffffff">
          <div class="tr">
            <div class="td">date</div>
            <div class="td">time</div>
            <div class="td">notes</div>
            <div class="td">plays</div>
            <div class="td">clears</div>
          </div>
        </div>
        <div class="tbody">
          <div v-for="stat in history.logs" :key="stat.date" class="tr">
            <div class="td">{{ stat.date }}</div>
            <div class="td">{{ stat.time() }}</div>
            <div class="td">{{ stat.notes().toLocaleString() }}</div>
            <div class="td">{{ stat.play_count }}</div>
            <div class="td">{{ stat.clear_count }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#history-page {
  padding-top: 20px;
}
</style>
