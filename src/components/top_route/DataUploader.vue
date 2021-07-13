<template>
  <div id="data-uploader">
    <h2 id="uploader-title" class="uploader-title">各種データアップロード</h2>
    <div>
      score.db と scorelog.db をアップロードするとスコア情報が更新されます。<br/>
      ファイルは<em>beatoraja/player/player*</em>にあります。
      <form>
        <label for="play_data" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'plus']"/>
          Choose file
          <input id="play_data" type="file" @change="onPlayDataUploaded" accept=".db" multiple required>
        </label>
        <div class="btn" :class="score_db ? 'btn-outline-success' : 'btn-outline-danger'">score.db</div>
        <div class="btn" :class="score_log_db ? 'btn-outline-success' : 'btn-outline-danger'">scorelog.db</div>
        <button
            type="submit"
            class="btn"
            :class="ready_upload_play_data ? 'btn-info' : 'btn-outline-info'"
            :disabled="!ready_upload_play_data"
            @click="uploadPlayData"
        >
          Submit
        </button>
        <div class="btn">{{ play_data_message }}</div>
      </form>
    </div>
    <hr>
    <div>
      表示されない曲がある場合は、songdata.dbをアップロードしてください。
      <form>
        <label for="song_data" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'plus']"/>
          Choose file
          <input id="song_data" type="file" @change="onSongDataUploaded" accept=".db" multiple required>
        </label>
        <div class="btn" :class="song_data_db ? 'btn-outline-success' : 'btn-outline-danger'">songdata.db</div>
        <button type="submit"
                class="btn"
                :class="ready_upload_song_data ? 'btn-info' : 'btn-outline-info'"
                :disabled="!ready_upload_song_data"
                @click="uploadSongData"
        >
          Submit
        </button>
        <div class="btn">{{ song_data_message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import Api from "../../api"

export default {
  name: "DataUploader",
  data: () => ({
    score_db: null,
    score_log_db: null,
    song_data_db: null,
    play_data_message: "",
    song_data_message: "",
  }),
  methods: {
    onPlayDataUploaded(e) {
      e.target.files.forEach(file => {
        if (file.name === "score.db") {
          this.score_db = file
        }
        if (file.name === "scorelog.db") {
          this.score_log_db = file
        }
      })
      this.play_data_message = ""
    },
    onSongDataUploaded(e) {
      e.target.files.forEach(file => {
        if (file.name === "songdata.db") {
          this.song_data_db = file
        }
      })
      this.song_data_message = ""
    },
    async uploadPlayData() {
      await Api.upload_play_data(this.$store.getters.accessToken, this.score_db, this.score_log_db)
      this.score_db = null
      this.score_log_db = null
      this.play_data_message = "OK"
    },
    async uploadSongData() {
      await Api.upload_song_data(this.$store.getters.accessToken, this.song_data_db)
      this.song_data_db = null
      this.song_data_message = "OK"
    }
  },
  computed: {
    ready_upload_play_data() {
      return !(!this.score_db || !this.score_log_db)
    },
    ready_upload_song_data() {
      return !!this.song_data_db
    }
  }
}
</script>

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