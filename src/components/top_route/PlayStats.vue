<script setup lang="ts">
import { useLoginStore } from '@/store/session'
import { ref } from "vue"
import Api from "../../api"
import PlayStats from "../../models/playStats"
import PlayCalendar from './play_stats/PlayCalendar.vue'
import UploadCalendar from './play_stats/UploadCalendar.vue'
import UploadStats from '../../models/uploadStats'

const store = useLoginStore()


// --- data ---
const history = ref(PlayStats.default())
const uploads = ref(UploadStats.default())
const calendarMode = ref<'play-date' | 'upload'>('play-date')

// --- computed ---
Api.fetch_play_stats(store.accessToken).then(
  (h) => (history.value = h)
)

Api.fetch_upload_list(store.accessToken).then((h) => (uploads.value = h))

</script>

<template>
  <section id="history-page">
    <h2>プレイ履歴</h2>
    <div class="calendar-mode-switch" role="group" aria-label="履歴の表示単位">
      <button :class="{ active: calendarMode === 'play-date' }" @click="calendarMode = 'play-date'">プレイ日付</button>
      <button :class="{ active: calendarMode === 'upload' }" @click="calendarMode = 'upload'">アップロード</button>
    </div>
    <PlayCalendar v-if="calendarMode === 'play-date'" :history="history"/>
    <UploadCalendar v-else :uploads="uploads" />
  </section>
</template>

<style scoped>
#history-page {
  padding-top: 20px;
}

.calendar-mode-switch {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.calendar-mode-switch button {
  border: 1px solid #007bff;
  border-radius: 4px;
  background: #fff;
  color: #007bff;
  cursor: pointer;
  padding: 8px 14px;
}

.calendar-mode-switch button.active {
  background: #007bff;
  color: #fff;
}
</style>
