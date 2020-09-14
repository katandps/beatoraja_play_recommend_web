<template>
  <tr :class="clear_type">
    <td>{{ level }}</td>
    <th>{{ title }}</th>
    <td>{{ score }}</td>
    <td>{{ min_bp }}</td>
    <td>{{ max_combo }}</td>
    <td>{{ updated_at }}</td>
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

<style>
.Failed {
  background: #b0b0b0
}
.LightAssistEasy {
  background: #ffb0ff
}
.Normal {
  background: #ffe0b0
}
.Easy {
  background: #d0ffd0
}
.Hard {
  background: #ffffff
}
.ExHard {
  background: #ffffb0
}
</style>