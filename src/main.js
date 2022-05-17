import {createApp} from 'vue'
import App from './App.vue'
const app = createApp(App);

import {router} from './router'
app.use(router);

import {store} from './store'
app.use(store);

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
    faXmark,
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
    faXmark,
)
import {faTwitterSquare} from '@fortawesome/free-brands-svg-icons'
library.add(faTwitterSquare)
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
app.component('font-awesome-icon', FontAwesomeIcon)
dom.watch()

app.use(require('vue-cookies'))

import VTooltip from 'v-tooltip'
let options = {defaultTrigger: 'hover focus click'}
app.use(VTooltip, options)

import * as log from "loglevel"
const logLevel = process.env.NODE_ENV === "development" ? log.levels.DEBUG : log.levels.SILENT
log.setLevel(logLevel, false)

require('./assets/sass/main.scss')
require('./assets/sass/tooltip.css')
require('./assets/sass/table.css')
app.config.productionTip = false

app.mount('#app')
