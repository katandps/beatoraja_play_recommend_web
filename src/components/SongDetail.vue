<template>
  <tr :class="'table-' + clear_type">
    <td>{{ level }}</td>
    <th>{{ title }}</th>
    <td>{{ (score / total_notes * 50).toFixed(2) }}</td>
    <td>{{ score }}/{{ total_notes * 2 }}</td>
    <td>{{ min_bp }}</td>
    <td>{{ max_combo }}/{{ total_notes }}</td>
    <td>{{ play_count }}</td>
    <td>{{ updated_at.split("T")[0] }}</td>
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
    play_count: {
      type: Number,
      required: true
    },
    updated_at: {
      type: String,
      required: true
    },
    total_notes: {
      type: Number,
      required: true
    }
  },
}
</script>

<style></style>