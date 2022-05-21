<script setup>
import HeaderCell from "./HeaderCell"
import Columns from "../../../../models/columns"

// --- props ---
defineProps({
  columns: Columns
})
</script>

<template>
  <div class="thead">
    <div class="tr">
      <HeaderCell :columns="columns" name="clear" />
      <HeaderCell :columns="columns" name="clear_date">
        Date(clear)
      </HeaderCell>
      <HeaderCell :columns="columns" name="clear_before" />

      <HeaderCell :columns="columns" name="level">Lv</HeaderCell>
      <HeaderCell :columns="columns" name="title"> Title </HeaderCell>

      <HeaderCell :columns="columns" name="score_rank">Rank</HeaderCell>
      <HeaderCell :columns="columns" name="detail_rank">DRank</HeaderCell>

      <HeaderCell :columns="columns" name="rate"> Rate </HeaderCell>
      <HeaderCell :columns="columns" name="score"> Ex/Max </HeaderCell>
      <HeaderCell :columns="columns" name="score_date">
        Date(Score)
      </HeaderCell>
      <HeaderCell :columns="columns" name="score_before"> Ex(old) </HeaderCell>

      <HeaderCell :columns="columns" name="bp"> BP </HeaderCell>
      <HeaderCell :columns="columns" name="bp_date"> Date(BP) </HeaderCell>
      <HeaderCell :columns="columns" name="bp_before"> BP(old) </HeaderCell>

      <HeaderCell :columns="columns" name="combo"> Combo </HeaderCell>

      <HeaderCell :columns="columns" name="play"> Play </HeaderCell>
      <HeaderCell :columns="columns" name="date"> Date </HeaderCell>

      <HeaderCell :columns="columns" name="clear_diff_rival">
        ClearVS
      </HeaderCell>
      <HeaderCell :columns="columns" name="score_diff_rival">
        ScoreVS
      </HeaderCell>
      <HeaderCell :columns="columns" name="bp_diff_rival"> BPVS </HeaderCell>
      <HeaderCell :columns="columns" name="rival_date"> RivalDate </HeaderCell>

      <HeaderCell :columns="columns" name="clear_update">
        ClearDiff
      </HeaderCell>
      <HeaderCell :columns="columns" name="rank_update"> RankDiff </HeaderCell>
      <HeaderCell :columns="columns" name="score_update">
        ScoreDiff
      </HeaderCell>
      <HeaderCell :columns="columns" name="bp_update"> BpDiff </HeaderCell>
    </div>
  </div>
</template>
