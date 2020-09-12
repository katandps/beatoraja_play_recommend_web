import Vue from 'vue'
import App from './App.vue'
import * as log from "loglevel"

Vue.config.productionTip = false

const logLevel = process.env.NODE_ENV === "development" ? log.levels.DEBUG : log.levels.SILENT;
log.setLevel(logLevel, false);

new Vue({
  render: h => h(App),
}).$mount('#app')
