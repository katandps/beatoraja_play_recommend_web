<template>
  <div id="profile-edit">
    <h1>プロフィール</h1>
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="name-input" class="btn btn-outline-secondary">
          名前</label>
      </div>
      <input id="name-input" class="form-control" v-model="name">
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="change_name"
               :class="disabled ? 'disabled' :''" :disabled="disabled">
          変更を反映
        </label>
      </div>
    </div>
    <br/>
    {{ message }}
  </div>
</template>

<script>
import Api from "../api.js"
import * as log from "loglevel"

export default {
  name: "ProfileEdit",
  data: () => ({
    name: "",
    message: "",
    lock: false,
  }),
  mounted() {
    log.debug(this.$store.getters.userInfo)
    this.name = this.$store.getters.userInfo.name
  },
  methods: {
    async change_name() {
      if (this.disabled) {
        return
      }
      this.lock = true
      await Api.change_user_name(this.$store.getters.accessToken, this.name).then(res => {
        this.$store.commit("setUserInfo", res)
        this.message = "" + this.name + "に更新しました。"
        this.lock = false
      }).catch(() => {
        this.message = "更新に失敗しました。"
      });
    }
  },
  computed: {
    disabled() {
      return this.lock || this.name === "" || this.name === this.$store.getters.userInfo.name
    }
  }
}
</script>

<style scoped>
#profile-edit {
  padding-top: 20px;
}
</style>