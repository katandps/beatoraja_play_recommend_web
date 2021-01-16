import Vue from 'vue'
import BootstrapVue from "bootstrap-vue";
import Router from 'vue-router'
import Home from "./components/Home"
import DataUploader from './components/DataUploader'
import OthersScore from "./components/OthersScore";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ProfileEdit from "./components/ProfileEdit";

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
            props: (route) => ({user_id: parseInt(route.query.user_id || 1)})
        },
        {
            path: '/upload',
            name: 'Upload',
            component: DataUploader,
        },
        {
            path: '/profile',
            name: 'ProfileEdit',
            component: ProfileEdit,
        }
    ]
})

export default router
