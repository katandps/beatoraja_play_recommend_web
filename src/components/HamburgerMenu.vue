<template>
  <div id="page-header">
    <!--ハンバーガーメニューのボタン-->
    <div class="hamburger_btn" v-on:click='active_btn=!active_btn'>
      <span class="line line_01"
            :class="(is_login ? 'line-login ' : 'line-logout ') + (active_btn ? 'btn_line01' : '')"/>
      <span class="line line_02"
            :class="(is_login ? 'line-login ' : 'line-logout ') + (active_btn ? 'btn_line02' : '')"/>
      <span class="line line_03"
            :class="(is_login ? 'line-login ' : 'line-logout ') + (active_btn ? 'btn_line03' : '')"/>
    </div>
    <!--サイドバー-->
    <transition name="menu">
      <div class="menu" v-show="active_btn">
        <ul>
          <li>
            <router-link class="text-dark px-2" to="/">
              <font-awesome-icon :icon="['fas', 'home']"/>
              ホーム
            </router-link>
          </li>
          <li>
            <router-link class="text-dark px-2" to="/view">
              <font-awesome-icon :icon="['fas', 'cubes']"/>
              スコア閲覧
            </router-link>
          </li>
        </ul>
        <ul v-if="is_login">
          <li>
            <router-link class="text-dark px-2" to="/profile">
              <font-awesome-icon :icon="['fas', 'pencil-alt']"/>
              プロフィール
            </router-link>
          </li>
          <li>
            <router-link class="text-dark px-2" :to="'/view?user_id='+user_id">
              <font-awesome-icon :icon="['fas', 'cube']"/>
              マイスコア
            </router-link>
          </li>
          <li>
            <router-link v-if="is_login" class="text-dark px-2" to="/upload">
              <font-awesome-icon :icon="['fas', 'file-upload']"/>
              スコアアップロード
            </router-link>
          </li>
          <li><a class="text-dark px-3" href="javascript:void(0);"
                 @click.prevent="handleSignOut">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']"/>
            ログアウト
          </a></li>
        </ul>
        <ul v-if="!is_login">
          <li><a class="text-dark px-3" :href="handleSignInUrl()">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']"/>
            登録/ログイン
          </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "HamburgerMenu",
  props: {
    is_login: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    active_btn: false
  }),
  methods: {
    handleSignInUrl() {
      let client_id = process.env.VUE_APP_CLIENT_ID;
      let redirect_url = process.env.VUE_APP_HOST + "/oauth";
      return "https://accounts.google.com/o/oauth2/auth?" +
          "include_granted_scopes=true" +
          "&redirect_uri=" + redirect_url +
          "&scope=openid%20email%20profile" +
          "&response_type=code" +
          "&approval_prompt=force" +
          "&access_type=offline" +
          "&client_id=" + client_id;
    },
    async handleSignOut() {
      this.$emit("handleSignOut");
    }
  },
  computed: {
    user_id() {
      if (!this.$store.getters.userInfo) {
        return ""
      }
      return this.$store.getters.userInfo.user_id;
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.path !== from.path) {
        this.active_btn = false;
      }
    }
  }
}
</script>

<style scoped>
/*ボタン*/
.hamburger_btn {
  position: fixed; /*常に最上部に表示したいので固定*/
  top: 0;
  right: 0;
  width: 70px;
  height: 72px;
  cursor: pointer;
  z-index: 50;
}

.hamburger_btn .line {
  position: absolute;
  top: 0;
  left: 20px;
  width: 32px;
  height: 2px;
  text-align: center;
}

.hamburger_btn .line-logout {
  background: #900000;
}

.hamburger_btn .line-login {
  background: #008000;
}


.hamburger_btn .line_01 {
  top: 16px;
  transition: 0.4s ease;
}

.hamburger_btn .line_02 {
  top: 25px;
  transition: 0.4s ease;
}

.hamburger_btn .line_03 {
  top: 34px;
  transition: 0.4s ease;
}


.btn_line01 {
  transform: translateY(9px) rotate(-45deg);
  transition: 0.4s ease;
}

.btn_line02 {
  transition: 0.4s ease;
  opacity: 0;
}

.btn_line03 {
  transform: translateY(-9px) rotate(45deg);
  transition: 0.4s ease;
}

/*サイドバー*/
.menu-enter-active, .menu-leave-active {
  transition: opacity 0.4s;
}

.menu-enter, .menu-leave-to {
  opacity: 0;
}

.menu-leave, .menu-enter-to {
  opacity: 1;
}

.menu li {
  list-style: none;
  line-height: 1;
  padding: 1rem;
}

.menu {
  background-color: rgba(180, 210, 255, 0.90);
  z-index: 30;
  padding: 2rem 1rem;
  position: fixed;
  width: 20rem;
  height: 100%;
  top: 0;
  right: 0;
}

.menu a {
  color: rgb(66, 66, 66);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0 2rem;
}

.menu ul {
  margin: 1rem;
  padding: 0;
}

</style>