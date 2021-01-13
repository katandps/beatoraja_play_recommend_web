import Vue from 'vue'
import App from './App.vue'
import * as log from "loglevel"
import router from './router'
import store from './store'
import VueJSModal from "vue-js-modal";

Vue.config.productionTip = false
Vue.use(require('vue-cookies'))
Vue.use(VueJSModal)

require('./assets/sass/main.scss')

const logLevel = process.env.NODE_ENV === "development" ? log.levels.DEBUG : log.levels.SILENT;
log.setLevel(logLevel, false);

new Vue({
  render: h => h(App),
  router,
  store,
  methods: {
    show: function() {
      this.$modal.show('modal-area');
    },
    hide: function() {
      this.$modal.hide('modal-area');
    },
  }
}).$mount('#app')
