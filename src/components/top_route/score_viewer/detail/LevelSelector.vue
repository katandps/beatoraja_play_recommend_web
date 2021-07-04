<template>
  <div class="input-group col-sm-6" role="group">
    <div class="input-group-prepend">
      <label for="all_list" class="btn btn-info text-nowrap"
             v-tooltip="'難易度表に登録されているすべてのレベルを表示対象にします'">
        全難易度表示
        <font-awesome-icon :icon="['fas', 'question-circle']"/>
      </label>
    </div>
    <input class="form-control" type="checkbox" id="all_list"
           v-model="filter.visible_all_levels">
  </div>
</template>

<script>
import SongFilter from "../../../../models/songFilter"

export default {
  name: "LevelSelector",
  props: {filter: {type: SongFilter, require: true}},
}
</script>

<style scoped>

</style>