import Vue from 'vue'
import BootstrapVue from "bootstrap-vue";
import Router from 'vue-router'
import Viewer from "./components/Viewer";
import Home from "./components/Home"
import DataUploader from './components/DataUploader'
import store from "./store";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/view',
            name: 'Viewer',
            component: Viewer
        },
        {
            path: '/upload',
            name: 'upload',
            component: DataUploader,
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (Object.keys(store.state.userInfo).length) {
            next()
        } else {
            next({path: '/', query: {redirect: to.fullPath}})
        }
    }
    next()
})

export default router
