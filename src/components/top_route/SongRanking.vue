<template>
  <div>
    <div v-if="ranking" style="padding-top: 20px">
      <div>
        <div>{{ ranking.song.title }}</div>
        <div>{{ ranking.song.notes }} notes</div>
      </div>
      <div class="table-wrapper">
        <div class="score-table">
          <div class="thead">
            <div class="tr">
              <div class="th sort_inactive">User</div>
              <div class="th score sort_inactive">Score</div>
              <div class="th bp sort_inactive">BP</div>
              <div class="th combo sort_inactive">Combo</div>
              <div class="th clear sort_inactive">Clear</div>
              <div class="th date sort_inactive">Date</div>
            </div>
          </div>
          <div class="tbody">
            <div class="tr" v-for="(score, user_id) in ranking.score" :key="user_id">
              <div class="th">
                <router-link :to="{path:'view', query: Object.assign({}, $route.query, {user_id: user_id})}">
                  {{ user_id }}
                </router-link>
              </div>
              <div class="th">{{ score.score ? score.score.current : '-'}}</div>
              <div class="th">{{ score.min_bp ? score.min_bp.current : '-'}}</div>
              <div class="th">{{ score.max_combo }}</div>
              <div class="th">{{ score.clear_type ? score.clear_type.current : 0 }}</div>
              <div class="th">{{ score.updated_at.split('T')[0] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
    <div v-else>
      Song is not selected.
    </div>
  </div>
</template>

<script>
import Api from "../../api"

export default {
  name: "SongRanking",
  props: {
    sha256: String,
    date: String,
  },
  data: () => ({
    ranking: null
  }),
  async beforeMount() {
    Api.fetch_ranking(this.$store.getters.accessToken, this.sha256, this.date).then(
        r => this.ranking = r.song.sha256 === "" ? null : r
    )
  }
}
</script>

<style scoped>

</style>