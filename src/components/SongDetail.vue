<template>
  <tr class="song">
    <th>{{ level }}</th>
    <th>{{ title }}</th>
    <th>{{ score }}</th>
    <th>{{ min_bp }}</th>
  </tr>
</template>

<script>
export default {
  name: "SongDetail",
  props: {
    level: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    min_bp: {
      type: Number,
      required: true
    }
  }
}
</script>

<style></style>