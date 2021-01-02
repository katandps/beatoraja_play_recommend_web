<template>
  <div id="app">
    <PageHeader :is_login="is_login" @handleSignOut="handleSignOut"/>
    <router-view/>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";
import Api from "./api";

export default {
  name: "App",
  components: {PageHeader},
  data: () => ({
    is_login: false,
  }),
  async mounted() {
    const now = this.is_login;
    if (this.$cookies.get("session-token")) {
      this.is_login = true;
    }

    // login route
    if (now ^ this.is_login) {
      let res = await Api.check_account(this.$cookies.get("session-token"));
      this.$store.commit("setUserInfo", res);
    }
  },
  watch: {
    // ルート切り替え検出
    '$route': async function (to, from) {
      if (this.is_login && to.path !== from.path) {
        if (!(await Api.check_account(this.$cookies.get("session-token"))).user_name) {
          await this.handleSignOut();
        }
      }
    }
  },
  methods: {
    async handleSignOut() {
      await Api.logout(this.$cookies.get("session-token"));
      await this.$cookies.remove("session-token");
      this.is_login = false;
      await this.$store.commit("setUserInfo", null);
      window.location.href = "/";
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
}
</style>