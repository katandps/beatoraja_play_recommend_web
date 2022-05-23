import { createRouter, createWebHashHistory } from "vue-router"
import MyPageVue from "./components/top_route/MyPage.vue"
import PlayStatsVue from "./components/top_route/PlayStats.vue"
import RecommendTableVue from "./components/top_route/RecommendTable.vue"
import ScoreViewerVue from "./components/top_route/ScoreViewer.vue"
import LampGraphVue from "./components/top_route/score_viewer/LampGraph.vue"
import RankGraphVue from "./components/top_route/score_viewer/RankGraph.vue"
import TheDetailVue from "./components/top_route/score_viewer/TheDetail.vue"
import TheRecentVue from "./components/top_route/score_viewer/TheRecent.vue"
import TheRivalVue from "./components/top_route/score_viewer/TheRival.vue"
import TheStatVue from "./components/top_route/score_viewer/TheStat.vue"
import SongRankingVue from "./components/top_route/SongRanking.vue"

import TheHomeVue from "./components/top_route/TheHome.vue"
import UserListVue from "./components/top_route/UserList.vue"

const routes = [
  { path: "/", component: () => TheHomeVue },
  {
    path: "/view",
    component: ScoreViewerVue,
    props: (route:any) => ({
      user_id: parseInt(route.query.user_id || 0),
      rival_id: parseInt(route.query.rival_id || 0)
    }),
    children: [
      { path: "", component: TheDetailVue},
      { path: "lamp", component: LampGraphVue
      },
      {
        path: "rank",
        component:RankGraphVue
      },
      {
        path: "stat",
        component: TheStatVue},
      {
        path: "recent",
        component: TheRecentVue},
      {
        path: "rival",
        component: TheRivalVue
      }
    ]
  },
  { path: "/mypage", component: MyPageVue},
  {
    path: "/stats",
    component: PlayStatsVue,
    props: (route:any) => ({ user_id: parseInt(route.query.user_id) })
  },
  {
    path: "/table",
    component:  RecommendTableVue,
    props: (route:any) => ({ user_id: parseInt(route.query.user_id) })
  },
  {
    path: "/song",
    component: SongRankingVue,
    props: (route:any) => ({ sha256: route.query.sha256, date: route.query.date })
  },
  {
    path: "/users",
    component: UserListVue
  }
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})