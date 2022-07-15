<script setup lang="ts">
import HamburgerMenu from "./components/HamburgerMenu.vue"
import Api from "./api"
import { debug } from "loglevel"
import { useCookies } from "vue3-cookies"
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useLoginStore } from "@/store/session"

const { cookies } = useCookies()
const loginStore = useLoginStore()
const route = useRoute()

// --- data ---
const is_login = ref(false)


// --- methods ---
const handleSignOut = async () => {
  await Api.logout(loginStore.accessToken)
  loginStore.accessToken = null
  loginStore.userInfo = null
  is_login.value = false
}

onMounted(async () => {
  if (cookies.get("session-token")) {
    loginStore.accessToken = cookies.get('session-token')
  }
  if (!loginStore.accessToken) { return }
  const account = await Api.get_account(loginStore.accessToken)
  debug(account)
  is_login.value = !account.error
  if (account.error) {
    loginStore.accessToken = null
  } else {
    loginStore.userInfo = account
  }
})

watch(route, async (cur, prev) => {
  if (is_login.value && cur.path !== prev.path) {
    const account = await Api.get_account(loginStore.accessToken)
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
