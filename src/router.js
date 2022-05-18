import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: '/', component: () => import('./components/top_route/Home') },
    {
        path: '/view',
        component: () => import('./components/top_route/ScoreViewer'),
        props: (route) => ({
            user_id: parseInt(route.query.user_id || 1),
            rival_id: parseInt(route.query.rival_id || 1),
        }),
        children: [
            {
                path: '',
                component: () => import('./components/top_route/score_viewer/Detail')
            },
            {
                path: 'lamp',
                component: () => import('./components/top_route/score_viewer/LampGraph')
            },
            {
                path: 'rank',
                component: () => import('./components/top_route/score_viewer/RankGraph')
            },
            {
                path: 'stat',
                component: () => import('./components/top_route/score_viewer/Stat')
            },
            {
                path: 'recent',
                component: () => import('./components/top_route/score_viewer/Recent')
            },
            {
                path: 'rival',
                component: () => import('./components/top_route/score_viewer/Rival')
            }
        ]
    },
    { path: '/mypage', component: () => import('./components/top_route/MyPage') },
    {
        path: '/stats',
        component: () => import('./components/top_route/PlayStats'),
        props: (route) => ({user_id: parseInt(route.query.user_id)})
    },
    {
        path: '/table',
        component: () => import('./components/top_route/RecommendTable'),
        props: (route) => ({user_id: parseInt(route.query.user_id)})
    },
    {
        path: '/song',
        component: () => import('./components/top_route/SongRanking'),
        props: (route) => ({sha256: route.query.sha256, date: route.query.date})
    },
    {
        path: '/users',
        component: () => import('./components/top_route/UserList'),
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})