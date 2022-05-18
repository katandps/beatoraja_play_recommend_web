import { createRouter, createWebHashHistory } from "vue-router"

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: import('./components/top_route/Home'),
        },
        {
            path: '/view',
            component: import('./components/top_route/ScoreViewer'),
            props: (route) => ({
                user_id: parseInt(route.query.user_id || 1),
                rival_id: parseInt(route.query.rival_id || 1),
            }),
            children: [
                {
                    path: '',
                    name: 'Detail',
                    component: import('./components/top_route/score_viewer/Detail')
                },
                {
                    path: 'lamp',
                    name: 'LampGraph',
                    component: import('./components/top_route/score_viewer/LampGraph')
                },
                {
                    path: 'rank',
                    name: 'RankGraph',
                    component: import('./components/top_route/score_viewer/RankGraph')
                },
                {
                    path: 'stat',
                    name: 'Stat',
                    component: import('./components/top_route/score_viewer/Stat')
                },
                {
                    path: 'recent',
                    name: 'Recent',
                    component: import('./components/top_route/score_viewer/Recent')
                },
                {
                    path: 'rival',
                    name: 'Rival',
                    component: import('./components/top_route/score_viewer/Rival')
                }
            ]
        },
        {
            path: '/mypage',
            name: 'MyPage',
            component: import('./components/top_route/MyPage'),
        },
        {
            path: '/stats',
            name: 'PlayStats',
            component: import('./components/top_route/PlayStats'),
            props: (route) => ({user_id: parseInt(route.query.user_id)})
        },
        {
            path: '/table',
            name: 'RecommendTable',
            component: import('./components/top_route/RecommendTable'),
            props: (route) => ({user_id: parseInt(route.query.user_id)})
        },
        {
            path: '/song',
            name: 'SongRanking',
            component: import('./components/top_route/SongRanking'),
            props: (route) => ({sha256: route.query.sha256, date: route.query.date})
        },
        {
            path: '/users',
            name: 'UserList',
            component: import('./components/top_route/UserList'),
        }
    ]
})