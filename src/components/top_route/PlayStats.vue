<script setup lang="ts">
import { useLoginStore } from '@/store/session'
import { useRouter } from 'vue-router'
import { ref } from "vue"
import Api from "../../api"
import PlayStats from "../../models/playStats"
import PlayCalendar from './play_stats/PlayCalendar.vue'
import UploadCalendar from './play_stats/UploadCalendar.vue'
import UploadStats from '../../models/uploadStats'

interface Props {
  date?: string | null | (string | null)[]
  uploadId?: string | null | (string | null)[]
}

const props = defineProps<Props>()
const store = useLoginStore()
const router = useRouter()

// --- data ---
const history = ref(PlayStats.default())
const uploads = ref(UploadStats.default())
const calendarMode = ref<'play-date' | 'upload'>(props.date || props.uploadId ? 'upload' : 'play-date')

const updateUploadSelection = (date: Date | null, uploadId: number | null) => {
  const query = { ...router.currentRoute.value.query }
  if (date) query.date = date.toISOString()
  else delete query.date
  if (uploadId) query.upload_id = String(uploadId)
  else delete query.upload_id
  void router.replace({ query })
}

// --- computed ---
Api.fetch_play_stats(store.accessToken).then(
  (h) => (history.value = h)
)

Api.fetch_upload_list(store.accessToken).then((h) => (uploads.value = h))

</script>

<template>
  <section id="history-page">
    <h2>プレイレポート</h2>
    <div class="calendar-mode-switch" role="group" aria-label="履歴の表示単位">
      <button :class="{ active: calendarMode === 'play-date' }" @click="calendarMode = 'play-date'">プレイ日別</button>
      <button :class="{ active: calendarMode === 'upload' }" @click="calendarMode = 'upload'">アップロード日別</button>
    </div>
    <PlayCalendar v-if="calendarMode === 'play-date'" :history="history"/>
    <UploadCalendar
      v-else
      :uploads="uploads"
      :date="props.date"
      :upload-id="props.uploadId"
      @selection-change="updateUploadSelection"
    />
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
