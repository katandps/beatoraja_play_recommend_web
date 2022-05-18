<template>
  <div id="app">
    <hamburger-menu :is_login="is_login" @handleSignOut="handleSignOut"/>
    <router-view :is_login="is_login" @handleSignOut="handleSignOut"/>
    <footer id="footer" class="footer mt-auto py-3">
      <div class="container">
        © 2020 KATAND<br/>
        <a href="https://twitter.com/dnaTaK">twitter@dnaTaK</a><br/>
        <router-link to="/view/?user_id=1">Score</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import HamburgerMenu from "./components/HamburgerMenu"
import Api from "./api"
import * as log from "loglevel"
import { useCookies } from "vue3-cookies"
import { useStore } from "vuex"
import { computed } from "vue"

export default {
  name: "App",
  components: {HamburgerMenu},
  data: () => ({
    is_login: false,
  }),
  setup () {
    const {cookies} = useCookies()
    const store = useStore()
    return {
      cookies: cookies,
      accessToken: computed(() => store.getters.accessToken)
    }
  },
  async mounted() {
    if (this.cookies.get("session-token")) {
      this.store.commit("setAccessToken", this.cookies.get("session-token"))
    }
    const account = await Api.get_account(this.accessToken);
    log.debug(account);
    this.is_login = !account.error;
    if (!account.error) this.store.commit('setUserInfo', account)
  },
  watch: {
    // ルート切り替え検出
    '$route': async function (to, from) {
      if (this.is_login && to.path !== from.path) {
        const account = await Api.get_account(this.accessToken);
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
  width: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

#footer {
  padding: 20px;
  background-color: #dddddd;
  border-radius: 0.3rem;
}
</style>