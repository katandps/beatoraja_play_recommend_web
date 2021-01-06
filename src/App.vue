<template>
  <div id="app">
    <PageHeader :is_login="is_login" @handleSignOut="handleSignOut"/>
    <router-view/>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";
import Api from "./api";
import * as log from "loglevel"

export default {
  name: "App",
  components: {PageHeader},
  data: () => ({
    is_login: false,
  }),
  async mounted() {
    if (this.$cookies.get("session-token")) {
      this.$store.commit("setAccessToken", this.$cookies.get("session-token"))
    }

    const account = await Api.get_account(this.$store.getters.accessToken);
    log.debug(account);
    this.is_login = !account.error;
    if (!account.error) this.$store.commit('setUserInfo', account);
  },
  watch: {
    // ルート切り替え検出
    '$route': async function (to, from) {
      if (this.is_login && to.path !== from.path) {
        const account = await Api.get_account(this.$store.getters.accessToken);
        log.debug(account);
        if (account.error) await this.handleSignOut();
      }
    }
  },
  methods: {
    async handleSignOut() {
      await Api.logout(this.$store.getters.accessToken);
      await this.$store.commit("setAccessToken", null);
      await this.$store.commit("setUserInfo", null);
      this.is_login = false;
      if (this.$router.currentRoute.path !== '/') {
        await this.$router.push('/');
      }
    }
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: scroll;
}
</style>