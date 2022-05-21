<script setup lang="ts">
import Columns from "../../../../models/columns"

// -- props --
const props = defineProps({
  columns: { type: Columns, require: true }
})

// -- methods --
const is_active = (name: string) => props.columns.column_is_active(name)
</script>

<template>
  <div class="colgroup">
    <div class="col clear" v-if="is_active('clear')" />
    <div class="col date" v-if="is_active('clear_date')" />
    <div class="col clear" v-if="is_active('clear_before')" />

    <div class="col level" v-if="is_active('level')" />
    <div class="col title" v-if="is_active('title')" />

    <div class="col rank" v-if="is_active('score_rank')" />
    <div class="col rank" v-if="is_active('detail_rank')" />

    <div class="col rate" v-if="is_active('rate')" />
    <div class="col score" v-if="is_active('score')" />
    <div class="col date" v-if="is_active('score_date')" />
    <div class="col score" v-if="is_active('score_before')" />

    <div class="col bp" v-if="is_active('bp')" />
    <div class="col date" v-if="is_active('bp_date')" />
    <div class="col bp" v-if="is_active('bp_before')" />

    <div class="col combo" v-if="is_active('combo')" />

    <div class="col play" v-if="is_active('play')" />
    <div class="col date" v-if="is_active('date')" />

    <div class="col clear_vs" v-if="is_active('clear_diff_rival')" />
    <div class="col score_vs" v-if="is_active('score_diff_rival')" />
    <div class="col bp_vs" v-if="is_active('bp_diff_rival')" />
    <div class="col date" v-if="is_active('rival_date')" />

    <div class="col" v-if="is_active('clear_update')" />
    <div class="col" v-if="is_active('rank_update')" />
    <div class="col" v-if="is_active('score_update')" />
    <div class="col" v-if="is_active('bp_update')" />
  </div>
</template>
