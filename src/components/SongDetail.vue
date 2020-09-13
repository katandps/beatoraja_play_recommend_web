<template>
  <tr class="song">
    <th>{{ level }}</th>
    <th>{{ title }}</th>
    <th>{{ score }}</th>
    <th>{{ min_bp }}</th>
    <th>{{ max_combo }}</th>
    <th>{{ clear_type }}</th>
    <th>{{ updated_at }}</th>
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
    },
    max_combo: {
      type: Number,
      required: true
    },
    clear_type: {
      type: String,
      required: true
    },
    updated_at: {
      type: String,
      required: true
    }
  },
}
</script>

<style></style>