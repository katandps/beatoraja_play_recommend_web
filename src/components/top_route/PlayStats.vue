<script setup lang="ts">
import { useLoginStore } from '@/store/session'
import { ref } from "vue"
import Api from "../../api"
import PlayStats from "../../models/playStats"
import PlayCalendar from './play_stats/PlayCalendar.vue'
import UploadStats from '../../models/uploadStats'

const store = useLoginStore()


// --- data ---
const history = ref(PlayStats.default())
const uploads = ref(UploadStats.default())

// --- computed ---
Api.fetch_play_stats(store.accessToken).then(
  (h) => (history.value = h)
)

Api.fetch_upload_list(store.accessToken).then((h) => (uploads.value = h))

</script>

<template>
  <section id="history-page">
    <h2>プレイ履歴</h2>
    <PlayCalendar :history="history" :uploads="uploads"/>
  </section>
</template>

<style scoped>
#history-page {
  padding-top: 20px;
}
</style>
