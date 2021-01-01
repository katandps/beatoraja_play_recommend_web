<template>
  <div id="profile-edit">
    <h1>プロフィール</h1>
    <label>
      名前:
      <input v-model="name">
    </label>
    <button class="btn btn-success" @click="change_name">変更を反映</button>
  </div>
</template>

<script>
import Api from "../api.js"

export default {
  name: "ProfileEdit",
  data: () => ({
    name: "",
  }),
  mounted() {
    this.name = this.$store.getters.userInfo.user_name;
  },
  methods: {
    async change_name() {
      if (this.name === "") {
        return;
      }
      let res = await Api.change_user_name(this.$cookies.get('session-token'), this.name);
      this.$store.commit("setUserInfo", res);
    }
  }
}
</script>

<style scoped>
#profile-edit {
  padding-top: 20px;
}
</style>