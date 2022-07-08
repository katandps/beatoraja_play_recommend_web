<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Api from "../../../api"

const store = useStore()

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
  if (!store.getters.userInfo) {
    return 1
  }
  return store.getters.userInfo.user_id
})

// --- methods ---
const onPlayDataUploaded = (e: any) => {
  console.log(e.target?.files)
  for (const file of e.target.files) {
    if (file.name === "score.db") {
      score_db.value = file
    }
    if (file.name === "scorelog.db") {
      score_log_db.value = file
    }
  }
  is_play_data_uploaded.value = false
}
const onSongDataUploaded = (e: any) => {
  for (const file of e.target.files) {
    if (file.name === "songdata.db") {
      song_data_db.value = file
    }
  }
  song_data_message.value = ""
}
const
  uploadPlayData = async () => {
    await Api.upload_play_data(
      store.getters.accessToken,
      score_db.value,
      score_log_db.value
    )
    score_db.value = null
    score_log_db.value = null
    is_play_data_uploaded.value = true
  }
const
  uploadSongData = async () => {
    await Api.upload_song_data(
      store.getters.accessToken,
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
