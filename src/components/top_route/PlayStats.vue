<script setup lang="ts">
import { useLoginStore } from '@/store/session'
import { ref } from "vue"
import Api from "../../api"
import PlayStats from "../../models/playStats"
import PlayCalendar from './play_stats/PlayCalendar.vue'

const store = useLoginStore()

interface Props {
  user_id: number
}
const props = defineProps<Props>()

// --- data ---
const history = ref(PlayStats.default())

// --- computed ---
Api.fetch_play_stats(store.accessToken, props.user_id).then(
  (h) => (history.value = h)
)

</script>

<template>
  <section id="history-page">
    <h2>プレイ履歴</h2>
    <PlayCalendar :history="history" />
  </section>
</template>

<style scoped>
#history-page {
  padding-top: 20px;
}
</style>
