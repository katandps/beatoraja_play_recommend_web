import Vue from 'vue'
import App from './App.vue'
import * as log from "loglevel"
import router from './router'
import store from './store'
import VueJSModal from "vue-js-modal";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(fas)
library.add(fab)

Vue.config.productionTip = false
Vue.use(require('vue-cookies'))
Vue.use(VueJSModal)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
