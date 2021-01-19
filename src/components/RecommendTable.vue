<template>
  <div id="recommend-table">
    <h2>おすすめ譜面表</h2>
    下記URLをbeatorajaに追加して下さい。<br/>
    <div class="form-group row align-items-center">
      <div class="btn-group col-sm-12">
        <label for="url_box"></label>
        <input id="url_box" class="form-control" type="text" :value="url"
               disabled>
        <button class="btn btn-secondary" @click="doCopy">
          <font-awesome-icon :icon="['fas', 'copy']"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "../api";
import * as log from 'loglevel'

export default {
  name: "RecommendTable",
  props: {
    user_id: {
      type: Number,
      required: true
    }
  },
  methods: {
    doCopy() {
      this.$copyText(this.url).then(function (e) {
        log.debug(e)
      }, function (e) {
        log.debug(e)
      })
    }
  },
  computed: {
    /**
     * @returns {string}
     */
    url() {
      return Api.get_table_header_url(this.user_id)
    }
  },
}
</script>

<style scoped>
#recommend-table {
  padding-top: 20px;
  max-width: 800px;
  margin: 0 auto 0 auto;
}

</style>