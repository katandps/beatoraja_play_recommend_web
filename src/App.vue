<script setup>
import HamburgerMenu from "./components/HamburgerMenu"
import Api from "./api"
import { debug } from "loglevel"
import { useCookies } from "vue3-cookies"
import { useStore } from "vuex"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const { cookies } = useCookies()
const store = useStore()
const router = useRouter()
const route = useRoute()

// --- data ---
const is_login = ref(false)

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)

// --- methods ---
const handleSignOut = async () => {
  await Api.logout(store.getters.accessToken)
  await store.commit("setAccessToken", null)
  await store.commit("setUserInfo", null)
  is_login.value = false
  if (router.currentRoute.path !== "/") {
    await router.push("/")
  }
}

onMounted(async () => {
  if (cookies.get("session-token")) {
    store.commit("setAccessToken", cookies.get("session-token"))
  }
  const account = await Api.get_account(accessToken.value)
  debug(account)
  is_login.value = !account.error
  if (!account.error) store.commit("setUserInfo", account)
})

watch(route, async (cur, prev) => {
  if (is_login.value && cur.path !== prev.path) {
    const account = await Api.get_account(accessToken.value)
    debug(account)
    if (account.error) await handleSignOut()
  }
})
</script>

<template>
  <div id="app">
    <hamburger-menu :is_login="is_login" @handleSignOut="handleSignOut" />
    <router-view :is_login="is_login" @handleSignOut="handleSignOut" />
    <footer id="footer" class="footer mt-auto py-3">
      <div class="container">
        © 2020 KATAND<br />
        <a href="https://twitter.com/dnaTaK">twitter@dnaTaK</a><br />
        <router-link to="/view/?user_id=1">Score</router-link>
      </div>
    </footer>
  </div>
</template>

<style>
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
