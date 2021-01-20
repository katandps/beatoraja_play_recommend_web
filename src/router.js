import Vue from 'vue'
import BootstrapVue from "bootstrap-vue";
import Router from 'vue-router'
import Home from "./components/Home"
import DataUploader from './components/DataUploader'
import ScoreViewer from "./components/ScoreViewer";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ProfileEdit from "./components/ProfileEdit";
import RecommendTable from "./components/RecommendTable";

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
            name: 'ScoreViewer',
            component: ScoreViewer,
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
        },
        {
            path: '/table',
            name: 'RecommendTable',
            component: RecommendTable,
            props: (route) => ({user_id: parseInt(route.query.user_id)})
        }
    ]
})

export default router
