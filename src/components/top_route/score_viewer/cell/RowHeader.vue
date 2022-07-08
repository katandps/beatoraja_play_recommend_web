<script setup lang="ts">
import HeaderCell from "./HeaderCell.vue"
import Columns from "../../../../models/columns"
import config from "../../../../const"

// --- props ---
defineProps({
  columns: Columns
})
</script>

<template>
  <div class="thead">
    <div class="tr">
      <HeaderCell v-for="obj in config.DETAIL_COLUMNS" :key="obj.key" :class="obj.class" :columns="columns"
        :name="obj.key">
        {{ obj.title }}
      </HeaderCell>
    </div>
  </div>
</template>
