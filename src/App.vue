<script setup lang="ts">
import HamburgerMenu from "./components/HamburgerMenu.vue"
import Api from "./api"
import { debug } from "loglevel"
import { useCookies } from "vue3-cookies"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useLoginStore } from "@/store/session"
import { AccountD } from "./types/generated/account"

const { cookies } = useCookies()
const loginStore = useLoginStore()
const route = useRoute()
const router = useRouter()

// --- data ---
const is_menu_open = ref(false)


// --- methods ---
const handleSignOut = async () => {
  await Api.logout(loginStore.accessToken)
  loginStore.accessToken = null
  loginStore.userInfo = null
  await router.push('/')
}

const handleMenuStateChange = (open: boolean) => {
  is_menu_open.value = open
}

function setLoginAccount(account: AccountD | null) {
  if (account) {
    loginStore.userInfo = {
      name: account.name,
      user_id: account.user_id,
      visibility: account.visibility,
    }
  } else {
    loginStore.reset()
  }
}

onMounted(async () => {
  if (cookies.get("session-token")) {
    loginStore.accessToken = cookies.get('session-token')
  }
  if (!loginStore.accessToken) { setLoginAccount(null); return }
  await Api.get_account(loginStore.accessToken).then(setLoginAccount).catch((e) => {
    debug(e)
    setLoginAccount(null)
  })
})

watch(route, async (cur, prev) => {
  if (loginStore.is_login() && cur.path !== prev.path) {
    const account = await Api.get_account(loginStore.accessToken)
    debug(account)
    if (!account || !account.user_id) await handleSignOut()
  }
})
</script>

<template>
  <div id="app" :class="{ 'menu-open': is_menu_open }">
    <div id="content">
      <router-view :is_login="loginStore.is_login()" @handleSignOut="handleSignOut" />
      <footer id="footer" class="footer mt-auto py-3">
        <div class="container">
          © 2020 KATAND<br />
          <a href="https://twitter.com/dnaTaK">twitter@dnaTaK</a><br />
          <router-link to="/view/?user_id=1">Score</router-link>
        </div>
      </footer>
    </div>
    <hamburger-menu :is_login="loginStore.is_login()" @handleSignOut="handleSignOut"
      @menuStateChange="handleMenuStateChange" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 98%;

  margin-left: auto;
  margin-right: auto;
}

#content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 98%;

  margin-left: auto;
  margin-right: auto;
}

#footer {
  padding: 20px;
  background-color: #dddddd;
  border-radius: 0.3rem;
  width: 100%;

  margin-left: auto;
  margin-right: auto;
}

/* 1080px 以上の画面ではメニューとコンテンツを横並びに配置 */
@media (min-width: 1080px) {
  #app {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
