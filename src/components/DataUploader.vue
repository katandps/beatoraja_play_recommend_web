<template>
  <div class="data-uploader">
    <h1 id="uploader-title" class="uploader-title">各種データアップロード</h1>
    <div class="upload">
      <ul>
        <li v-for="(file) in files_score" :key="file.id">
          <span>{{ file.name }}</span> -
          <span>{{ file.size }} バイト</span> -
          <span v-if="file.error">{{ file.error }}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <div class="btn">
        <VueUploadComponent
            class="btn btn-primary"
            input-id="files_score"
            :post-action="uploadScoreUrl()"
            v-model="files_score"
            ref="upload_score"
            @input-filter="inputFilterScore"
        >
          <i class="fa fa-plus"></i>
          score.dbを選択する
        </VueUploadComponent>
        <button type="button" class="btn btn-success" v-if="!$refs.upload_score || !$refs.upload_score.active"
                @click.prevent="$refs.upload_score.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
        <button type="button" class="btn btn-danger" v-else @click.prevent="$refs.upload_score.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          Stop Upload
        </button>
      </div>
    </div>


    <div class="upload">
      <ul>
        <li v-for="(file) in files_score_log" :key="file.id">
          <span>{{ file.name }}</span> -
          <span>{{ file.size }}</span> -
          <span v-if="file.error">{{ file.error }}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <div class="btn">
        <VueUploadComponent
            class="btn btn-primary"
            input-id="files_score_log"
            :post-action="uploadScoreLogUrl()"
            v-model="files_score_log"
            ref="upload_score_log"
            @input-filter="inputFilterScoreLog"
        >
          <i class="fa fa-plus"></i>
          scorelog.dbを選択する
        </VueUploadComponent>
        <button type="button" class="btn btn-success" v-if="!$refs.upload_score_log || !$refs.upload_score_log.active"
                @click.prevent="$refs.upload_score_log.active = true">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
          Start Upload
        </button>
        <button type="button" class="btn btn-danger" v-else @click.prevent="$refs.upload_score_log.active = false">
          <i class="fa fa-stop" aria-hidden="true"></i>
          Stop Upload
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueUploadComponent from "vue-upload-component";
import Api from "../api";

export default {
  name: "DataUploader",
  components: {VueUploadComponent},
  data: () => ({
    files_score: [],
    files_score_log: []
  }),
  methods: {
    inputFilterScore(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (newFile.name !== "score.db") {
          return prevent()
        }
      }
    },
    inputFilterScoreLog(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (newFile.name !== "scorelog.db") {
          return prevent()
        }
      }
    },
    uploadScoreUrl() {
      return Api.get_upload_score_url();
    },
    uploadScoreLogUrl() {
      return Api.get_upload_score_log_url();
    }
  }
}
</script>

<style scoped>
#data-uploader {
  padding-top: 20px;
}

.file-uploads {
  overflow: hidden;
  position: relative;
  text-align: center;
  display: inline-block;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: .5rem .75rem;
  font-size: 1rem;
  line-height: 1.25;
  border-radius: .25rem;
  transition: all .15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

ul {
  padding: 15px;
}

.thumb {
  width: 50px;
}
</style>