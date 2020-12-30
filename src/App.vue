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
  mounted() {
    if (this.$cookies.get("session-token")) {
      this.is_login = true;
    }
  },
  watch: {
    // ルート切り替え検出
    '$route': async function (to, from) {
      if (this.is_login && to.path !== from.path) {
        if (!(await Api.check_account(this.$cookies.get("session-token"))).ok) {
          await this.handleSignOut();
        }
      }
    }
  },
  methods: {
    async handleSignOut() {
      await Api.logout(this.$cookies.get("session-token"));
      this.$cookies.remove("session-token");
      this.is_login = false;
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