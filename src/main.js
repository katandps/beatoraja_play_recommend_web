import Vue from 'vue'


import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {library} from '@fortawesome/fontawesome-svg-core'

library.add(fas)
library.add(fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(require('vue-cookies'))


import VueJSModal from "vue-js-modal";

Vue.use(VueJSModal)


import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)


import VTooltip from 'v-tooltip'

let options = {defaultTrigger: 'hover focus click'}
Vue.use(VTooltip, options)


import * as log from "loglevel"

const logLevel = process.env.NODE_ENV === "development" ? log.levels.DEBUG : log.levels.SILENT
log.setLevel(logLevel, false)


require('./assets/sass/main.scss')
require('./assets/sass/tooltip.css')

Vue.config.productionTip = false
import router from './router'
import store from './store'
import App from './App.vue'

new Vue({
    render: h => h(App),
    router,
    store,
    methods: {
        show: function () {
            this.$modal.show('modal-area')
        },
        hide: function () {
            this.$modal.hide('modal-area')
        },
    }
}).$mount('#app')
