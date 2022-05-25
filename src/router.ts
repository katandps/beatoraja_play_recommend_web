import { createRouter, createWebHashHistory } from "vue-router"
import MyPageVue from "./components/top_route/MyPage.vue"
import PlayStatsVue from "./components/top_route/PlayStats.vue"
import RecommendTableVue from "./components/top_route/RecommendTable.vue"
import ScoreViewerVue from "./components/top_route/ScoreViewer.vue"
import SongRankingVue from "./components/top_route/SongRanking.vue"
import TheHomeVue from "./components/top_route/TheHome.vue"

const routes = [
  { path: "/", component: async () => TheHomeVue },
  {
    path: "/view",
    component: ScoreViewerVue,
    props: (route:any) => ({
      user_id: parseInt(route.query.user_id || 0),
      rival_id: parseInt(route.query.rival_id || 0),
      mode: "detail"
    }),
  },
  {
    path: "/view/:mode",
    component: ScoreViewerVue,
    props: (route:any) => ({
      user_id: parseInt(route.query.user_id || 0),
      rival_id: parseInt(route.query.rival_id || 0),
      mode: route.params.mode
    }),
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
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
