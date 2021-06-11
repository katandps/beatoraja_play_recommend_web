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
    <hr>
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="visibility-input" class="btn btn-outline-secondary">
          プロフィールの表示
          <font-awesome-icon :icon="['fas', 'wrench']"/>
        </label>
      </div>
      <input id="visibility-input" class="form-control" type="checkbox" v-model="visibility">
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="change_visibility">
          変更を反映
        </label>
      </div>
    </div>
    <br/>
    {{ message }}
  </div>
</template>

<script>
import Api from "../../api.js"
import * as log from "loglevel"

export default {
  name: "ProfileEdit",
  data: () => ({
    name: "",
    message: "",
    visibility: false,
    lock: false,
  }),
  mounted() {
    log.debug(this.$store.getters.userInfo)
    this.name = this.$store.getters.userInfo.name
    this.visibility = this.$store.getters.userInfo.visibility
  },
  methods: {
    async change_name() {
      if (this.disabled) {
        return
      }
      this.lock = true
      await Api.change_user_name(this.$store.getters.accessToken, this.name).then(res => {
        log.debug(res)
        this.$store.commit("setUserInfo", res)
        this.message = "" + this.name + "に更新しました。"
        this.lock = false
      }).catch(() => {
        this.message = "更新に失敗しました。"
      })
    },
    async change_visibility() {
      if (this.visibility === this.$store.getters.userInfo.visibility) {
        return
      }
      const to = this.visibility
      await Api.change_visibility(this.$store.getters.accessToken, to).then(res => {
        log.debug(res)
        this.$store.commit("setUserInfo", res)
        this.message = to ? "プロフィールを表示状態にしました。" : "プロフィールを非表示状態にしました。"
      }).catch(() => {
        this.message = "更新に失敗しました。"
      })
    }
  },
  computed: {
    disabled() {
      return this.lock || this.name === "" || !this.$store.getters.userInfo || this.$store.getters.userInfo.name === this.name
    }
  }
}
</script>

<style scoped>
#profile-edit {
  padding-top: 20px;
}
</style>