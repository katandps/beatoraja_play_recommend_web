<template>
  <div id="input-user" class="form-group row align-items-center">
    <div class="input-group col-sm-6">
      <div class="input-group-prepend">
        <label for="input_user_id" class="btn btn-info text-nowrap"
               v-tooltip="'IDを入力後、更新をタップすると反映されます'">
          ユーザーID
          <font-awesome-icon :icon="['fas', 'question-circle']"/>
        </label>
      </div>
      <input id="input_user_id" class="form-control" v-model="input_user_id">
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="onClick">
          更新
          <font-awesome-icon :icon="['fas', 'sync']"/>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import * as log from 'loglevel'

export default {
  name: "InputUserId",
  props: {
    user_id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    input_user_id: 0,
  }),
  mounted() {
    this.input_user_id = this.user_id
  },
  methods: {
    async onClick() {
      let query = Object.assign({}, this.$route.query)
      query.user_id = this.input_user_id
      log.debug(query)
      await this.$router.push({
        name: 'ScoreViewer',
        query: query
      }).catch(() => {})
      this.$emit('refreshData')
    }
  }
}
</script>

<style scoped>
#input-user {
  margin-right: 40px;
}
</style>