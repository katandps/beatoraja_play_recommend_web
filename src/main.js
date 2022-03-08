import Vue from 'vue'

/**
 * FontAwesomeの登録
 */
import {library, dom} from '@fortawesome/fontawesome-svg-core'

import {
    faHome,
    faCubes,
    faPencilAlt,
    faCube,
    faThumbsUp,
    faWrench,
    faFileUpload,
    faSignOutAlt,
    faSignInAlt,
    faCopy,
    faQuestionCircle,
    faUndo,
    faSync,
    faUsers,
    faStop,
    faArrowUp,
    faPlus,
    faLongArrowAltRight,
    faSquare,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faHome,
    faCubes,
    faPencilAlt,
    faCube,
    faThumbsUp,
    faWrench,
    faFileUpload,
    faSignOutAlt,
    faSignInAlt,
    faCopy,
    faQuestionCircle,
    faUndo,
    faSync,
    faUsers,
    faStop,
    faArrowUp,
    faPlus,
    faLongArrowAltRight,
    faSquare,
)

import {faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
library.add(faTwitterSquare)

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
Vue.component('font-awesome-icon', FontAwesomeIcon)

dom.watch()

Vue.use(require('vue-cookies'))


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
require('./assets/sass/table.css')
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
import router from './router'
import store from './store'
import App from './App.vue'

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
