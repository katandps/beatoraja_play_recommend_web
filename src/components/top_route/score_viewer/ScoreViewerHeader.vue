<template>
  <div>
    <h2>
      {{ model.user_name() }}のデータ
      <a :href="model.get_twitter_link()" target="_blank"
         v-if="model.song_is_set()">
        <font-awesome-icon :icon="['fab', 'twitter-square']"/>
      </a>
    </h2>
    <h3 v-if="model.rival_name && here_is_rival">
      ライバル表示: {{ model.rival_name }}
    </h3>
  </div>
</template>

<script>
import Model from "../../../models/model";

export default {
  name: "ScoreViewerHeader",
  props: {
    model: {type: Model, require: true},
  },
  computed: {
    here_is_rival() {
      return this.$route.name === 'ViewRival'
    }
  }
}
</script>

<style scoped>

</style>