<script setup lang="ts">
import { useLoginStore } from "@/store/session"
import { computed, ref } from "vue"
import Api from "../../../api"

const loginStore = useLoginStore()

const score_db = ref()
const score_log_db = ref()
const song_data_db = ref()
const is_play_data_uploaded = ref()
const song_data_message = ref()

// --- computed ---
const ready_upload_play_data = computed(() =>
  !(!score_db.value || !score_log_db.value)
)
const ready_upload_song_data = computed(() => {
  return !!song_data_db.value
})
const user_id = computed(() => {
  if (!loginStore.userInfo) {
    return 1
  }
  return loginStore.userInfo.user_id
})

// --- methods ---
const onPlayDataUploaded = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    console.log(files)
    for (const file of files) {
      if (file.name === "score.db") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const arrayBuffer = e.target?.result
          if (arrayBuffer instanceof ArrayBuffer) {
            score_db.value = arrayBuffer
          }
        };
        reader.onerror = (e: ProgressEvent<FileReader>) => {
          console.error('error with read file', e);
        };
        reader.readAsArrayBuffer(file);
      }
      if (file.name === "scorelog.db") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const arrayBuffer = e.target?.result
          if (arrayBuffer instanceof ArrayBuffer) {
            score_log_db.value = arrayBuffer
          }
        };
        reader.onerror = (e: ProgressEvent<FileReader>) => {
          console.error('error with read file', e);
        };
        reader.readAsArrayBuffer(file);
      }
    }
    is_play_data_uploaded.value = false
  }
}
const onSongDataUploaded = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.name === "songdata.db") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const arrayBuffer = e.target?.result
          if (arrayBuffer instanceof ArrayBuffer) {
            song_data_db.value = arrayBuffer
            song_data_message.value = ""
          }
        };
        reader.onerror = (e: ProgressEvent<FileReader>) => {
          console.error('error with read file', e);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }
}
const uploadPlayData = async () => {
  await Api.upload_play_data(
    loginStore.accessToken,
    score_db.value,
    score_log_db.value
  )
  score_db.value = null
  score_log_db.value = null
  is_play_data_uploaded.value = true
}
const uploadSongData = async () => {
  await Api.upload_song_data(
    loginStore.accessToken,
    song_data_db.value
  )
  song_data_db.value = null
  song_data_message.value = "OK"
}

</script>

<template>
  <div id="data-uploader">
    <h2 id="uploader-title" class="uploader-title">各種データアップロード</h2>
    <div>
      score.db と scorelog.db をアップロードするとスコア情報が更新されます。<br />
      ファイルは<em>beatoraja/player/player*</em>にあります。
      <form>
        <label for="play_data" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Choose file
          <input id="play_data" type="file" @change="onPlayDataUploaded" accept=".db" multiple required />
        </label>
        <div class="btn" :class="score_db ? 'btn-outline-success' : 'btn-outline-danger'">
          score.db
        </div>
        <div class="btn" :class="score_log_db ? 'btn-outline-success' : 'btn-outline-danger'">
          scorelog.db
        </div>
        <button type="submit" class="btn" :class="ready_upload_play_data ? 'btn-info' : 'btn-outline-info'"
          :disabled="!ready_upload_play_data" @click="uploadPlayData">
          Submit
        </button>
        <router-link v-if="is_play_data_uploaded" class="btn" :to="{
          path: '/view/',
          query: Object.assign({}, $route.query, { user_id: user_id })
        }">
          結果を見る
        </router-link>
      </form>
    </div>
    <hr />
    <div>
      表示されない曲がある場合は、songdata.dbをアップロードしてください。
      <form>
        <label for="song_data" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Choose file
          <input id="song_data" type="file" @change="onSongDataUploaded" accept=".db" multiple required />
        </label>
        <div class="btn" :class="song_data_db ? 'btn-outline-success' : 'btn-outline-danger'">
          songdata.db
        </div>
        <button type="submit" class="btn" :class="ready_upload_song_data ? 'btn-info' : 'btn-outline-info'"
          :disabled="!ready_upload_song_data" @click="uploadSongData">
          Submit
        </button>
        <div class="btn">{{ song_data_message }}</div>
      </form>
    </div>
    <br />
  </div>
</template>

<style scoped>
#data-uploader {
  padding-top: 20px;
}

input#play_data {
  display: none;
}

input#song_data {
  display: none;
}

label {
  margin-bottom: 0;
}
</style>
