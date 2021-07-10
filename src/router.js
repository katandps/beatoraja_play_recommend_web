import Vue from 'vue'
import Router from 'vue-router'

import Home from "./components/top_route/Home"
import DataUploader from './components/top_route/DataUploader'
import ScoreViewer from "./components/top_route/ScoreViewer"
import ProfileEdit from "./components/top_route/ProfileEdit"
import RecommendTable from "./components/top_route/RecommendTable"
import UserList from "./components/top_route/UserList"
import Detail from "./components/top_route/score_viewer/Detail"
import LampGraph from "./components/top_route/score_viewer/LampGraph"
import RankGraph from "./components/top_route/score_viewer/RankGraph"
import Stat from "./components/top_route/score_viewer/Stat"
import Recent from "./components/top_route/score_viewer/Recent"
import Rival from "./components/top_route/score_viewer/Rival"
import SongRanking from "./components/top_route/SongRanking"

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            props: true
        },
        {
            path: '/view',
            component: ScoreViewer,
            props: (route) => ({
                user_id: parseInt(route.query.user_id || 1),
                rival_id: parseInt(route.query.rival_id || 1),
            }),
            children: [
                {
                    path: 'lamp',
                    name: 'ViewLampGraph',
                    component: LampGraph
                },
                {
                    path: 'rank',
                    name: 'ViewRankGraph',
                    component: RankGraph
                },
                {
                    path: 'stat',
                    name: 'ViewStat',
                    component: Stat
                },
                {
                    path: '',
                    name: 'ViewDetail',
                    component: Detail
                },
                {
                    path: 'recent',
                    name: 'ViewRecent',
                    component: Recent
                },
                {
                    path: 'rival',
                    name: 'ViewRival',
                    component: Rival
                }
            ]
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
        },
        {
            path: '/song',
            name: 'SongRanking',
            component: SongRanking,
            props: (route) => ({sha256: route.query.sha256, date: route.query.date})
        },
        {
            path: '/users',
            name: 'UserList',
            component: UserList,
        }
    ]
})

export default router
