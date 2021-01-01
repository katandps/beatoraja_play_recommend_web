<template>
  <div id="page-header">
    <!--ハンバーガーメニューのボタン-->
    <div class="hamburger_btn" v-on:click='active_btn=!active_btn'>
      <span class="line line_01" v-bind:class="{'btn_line01':active_btn}"></span>
      <span class="line line_02" v-bind:class="{'btn_line02':active_btn}"></span>
      <span class="line line_03" v-bind:class="{'btn_line03':active_btn}"></span>
    </div>
    <!--サイドバー-->
    <transition name="menu">
      <div class="menu" v-show="active_btn">
        <ul>
          <li>
            <router-link class="text-dark px-2" to="/">ホーム</router-link>
          </li>
          <li>
            <router-link class="text-dark px-2" to="view">スコア閲覧</router-link>
          </li>
        </ul>
        <ul v-if="is_login">
          <li>
            <router-link class="text-dark px-2" to="/my_score">マイスコア</router-link>
          </li>
          <li>
            <router-link v-if="is_login" class="text-dark px-2" to="/upload">スコアアップロード</router-link>
          </li>
          <li><a class="text-dark px-3" href="javascript:void(0);"
                 @click.prevent="handleSignOut">ログアウト</a></li>
        </ul>
        <ul v-if="!is_login">
          <li><a class="text-dark px-3" :href="handleSignInUrl()">ログイン</a></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    is_login: {
      type: Boolean,
      required: true,
    }
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
          "&scope=openid" +
          "&response_type=code" +
          "&approval_prompt=force" +
          "&access_type=offline" +
          "&client_id=" + client_id;
    },
    async handleSignOut() {
      this.$emit("handleSignOut");
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
  background: #333333;
  text-align: center;
}

.hamburger_btn .line_01 {
  top: 16px;
  transition: 0.4s ease;
}

.hamburger_btn .line_02 {
  top: 26px;
  transition: 0.4s ease;
}

.hamburger_btn .line_03 {
  top: 36px;
  transition: 0.4s ease;
}


.btn_line01 {
  transform: translateY(10px) rotate(-45deg);
  transition: 0.4s ease;
}

.btn_line02 {
  transition: 0.4s ease;
  opacity: 0;
}

.btn_line03 {
  transform: translateY(-10px) rotate(45deg);
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
  background-color: rgba(197, 197, 197, 0.80);
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