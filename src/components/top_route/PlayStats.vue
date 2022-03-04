<template>
  <section id="history-page">
    <h2>プレイ履歴</h2>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="thead">
          <div class="tr">
            <div class="td">date</div>
            <div class="td">time</div>
            <div class="td">notes</div>
          </div>
        </div>
        <div class="tbody">
          <div v-for="stat in history.logs" :key="stat.date" class="tr">
            <div class="td">{{ stat.date }}</div>
            <div class="td">{{ stat.play_time }}</div>
            <div class="td">{{ stat.notes() }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Api from "../../api"
import PlayStats from "../../models/playStats"

export default {
  name: "PlayStats",
  props: {
    user_id: {
      type: Number,
    }
  },
  data: () => ({
    history: PlayStats.default()
  }),
  async beforeMount() {
    Api.fetch_play_stats(this.$store.getters.accessToken, this.user_id).then(
        h => this.history = h
    )
  }
}
</script>

<style scoped>
#history-page{
  padding-top: 20px;
}
</style>