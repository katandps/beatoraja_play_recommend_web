import Vue from 'vue'
import BootstrapVue from "bootstrap-vue";
import Router from 'vue-router'
import Home from "./components/Home"
import DataUploader from './components/DataUploader'
import store from "./store";
import MyScore from "./components/MyScore";
import OthersScore from "./components/OthersScore";

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
            name: 'OthersScore',
            component: OthersScore,
            props: (route) => ({id: parseInt(route.query.user_id)})
        },
        {
            path: '/upload',
            name: 'Upload',
            component: DataUploader,
            meta: {requiresAuth: true}
        },
        {
            path: '/my_score',
            name: 'My_score',
            component: MyScore,
            meta: {requiresAuth: true}
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
