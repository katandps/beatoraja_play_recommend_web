import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import * as log from "loglevel"

Vue.config.productionTip = false
Vue.use(BootstrapVue)

require('./assets/sass/main.scss')

const logLevel = process.env.NODE_ENV === "development" ? log.levels.DEBUG : log.levels.SILENT;
log.setLevel(logLevel, false);

new Vue({
  render: h => h(App),
}).$mount('#app')
