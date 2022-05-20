<template>
  <div>
    <h2>
      {{ user_name }}のデータ
      <a :href="twlink" target="_blank"
         v-if="song_is_set">
        <font-awesome-icon :icon="['fab', 'twitter-square']"/>
      </a>
    </h2>
    <h3 v-if="rival_name && here_is_rival">
      ライバル表示: {{ rival_name }}
    </h3>
  </div>
</template>

<script>
export default {
  name: "ScoreViewerHeader",
  props: {
    user_name: {type: String},
    rival_name: {type: String},
    twlink: {type: String},
    song_is_set: {type: Boolean}
  },
  computed: {
    here_is_rival() {
      return this.$route.name === 'ViewRival'
    }
  }
}
</script>

<style scoped></style>