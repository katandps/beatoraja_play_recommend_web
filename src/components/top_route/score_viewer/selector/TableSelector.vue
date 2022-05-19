<template>
  <div id="table_selector" class="row align-items-center">
    <div class="col-sm-5">
      <div class="input-group" role="group" aria-label="Difficulty Table">
        <div class="input-group-prepend">
          <label for="table" class="btn btn-info text-nowrap" v-tooltip="'表示する難易度表'">
            難易度表
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="table" class="form-control" name="table" v-model="table">
          <option v-for="(name,index) in table_list" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
    </div>
    <div class="col-sm-3" v-tooltip="'難易度別表示の状態を切り替えます'" v-if="can_level_select">
      <input class="btn-check" type="checkbox" id="all_list" v-model="visible_all_levels">
      <label class="btn btn-outline-info" for="all_list">
          全難易度表示
          <font-awesome-icon :icon="['fas', 'question-circle']"/>
      </label>
    </div>
    <div class="col-sm-4" v-if="can_level_select && !visible_all_levels">
      <div class="input-group" role="group" aria-label="Difficulty">
        <div class="input-group-prepend">
          <label for="level" class="btn btn-info text-nowrap" v-tooltip="'詳細表で表示する難易度'">
            難易度
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="level" class="form-control" name="level" v-model="level">
          <option v-for="(level,key) in level_list" :key="key">
            {{ level }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { DifficultyTable } from '../../../../models/difficultyTable'
export default {
  name: "TableSelector",
  props: {
    table_list: { required: true },
    level_list: { required: false },
    can_level_select: { type: Boolean },
    selected_table: { type: DifficultyTable, required: true },
    selected_level: { type: String },
    visible_all_level: {type: Boolean },
  },
  computed: {
    table: {
      get() { return this.selected_table.name },
      set(value) { this.$emit('setTable', value) }
    },
    level: {
      get() { return this.selected_level },
      set(value) { this.$emit('setLevel', value) }
    },
    visible_all_levels: {
      get() { return !!this.visible_all_level },
      set(value) { this.$emit('setVisibleAllLevelsFlag', value) }
    }
  }
}
</script>
