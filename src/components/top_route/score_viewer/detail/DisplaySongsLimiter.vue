<template>
  <div class="form-group align-items-center">
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="max_length" class="btn btn-info text-nowrap"
               v-tooltip="'詳細表上に表示する曲数を制限します フィルタリングは全曲から行われます'">
          表示曲数
          <font-awesome-icon :icon="['fas', 'question-circle']"/>
        </label>
      </div>
      <input id="max_length" v-model="filter.max_length"
             class="form-control">
      <div class="input-group-append">
        <label for="max_length" class="btn btn-info text-nowrap">曲</label>
      </div>
    </div>
  </div>
</template>

<script>
import SongFilter from "../../../../models/songFilter"

export default {
  name: "DisplaySongsLimiter",
  props: {filter: SongFilter},
}
</script>

<style scoped>

</style>