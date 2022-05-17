import { createRouter, createWebHistory } from "vue-router"

import Home from "./components/top_route/Home"
import ScoreViewer from "./components/top_route/ScoreViewer"
import RecommendTable from "./components/top_route/RecommendTable"
import UserList from "./components/top_route/UserList"
import Detail from "./components/top_route/score_viewer/Detail"
import LampGraph from "./components/top_route/score_viewer/LampGraph"
import RankGraph from "./components/top_route/score_viewer/RankGraph"
import Stat from "./components/top_route/score_viewer/Stat"
import Recent from "./components/top_route/score_viewer/Recent"
import Rival from "./components/top_route/score_viewer/Rival"
import SongRanking from "./components/top_route/SongRanking"
import MyPage from "./components/top_route/MyPage"
import PlayStats from "./components/top_route/PlayStats"

export const router = createRouter({
    history: createWebHistory(),
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
            path: '/mypage',
            name: 'MyPage',
            component: MyPage,
        },
        {
            path: '/stats',
            name: 'PlayStats',
            component: PlayStats,
            props: (route) => ({user_id: parseInt(route.query.user_id)})
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