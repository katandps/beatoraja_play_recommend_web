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
    <div class="col-sm-4" v-if="can_level_select">
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
export default {
  name: "TableSelector",
  props: {
    table_list: { required: true },
    level_list: { required: true },
    can_level_select: { type: Boolean, required: false },
    selected_table: { type: String, required: true },
    selected_level: { type: String, required: true }
  },
  data: () => ({
    table: "",
    level: "",
    visible_all_levels: false,
  }),
  beforeMount() {
    this.visible_all_levels = this.$store.state.filter.visible_all_levels
  },
  mounted() {
    this.table = this.selected_table
    this.level = this.selected_level
  },
  methods: {},
  watch: {
    selected_level() {
      this.level = this.selected_level
    },
    table() {
      this.$emit('setTable', this.table);
    },
    level() {
      this.$emit('setLevel', this.level)
    },
    visible_all_levels() {
      this.$store.commit('setVisibleAllLevelsFlag', this.visible_all_levels)
    }
  }
}
</script>
