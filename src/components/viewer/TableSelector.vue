<template>
  <div id="table_selector">
    <div class="form-group row align-items-center">
      <div class="input-group col-sm-6" role="group"
           aria-label="Difficulty Table">
        <div class="input-group-prepend">
          <label for="table" class="btn btn-info text-nowrap"
                 v-tooltip="'表示する難易度表'">
            難易度表
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="table" class="form-control"
                name="table" v-model="selected">
          <option v-for="(name,index) in model.get_table_names()" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
      <div class="input-group col-sm-6" role="group" aria-label="Difficulty">
        <div class="input-group-prepend">
          <label for="level" class="btn btn-info text-nowrap"
                 v-tooltip="'詳細表で表示する難易度'">
            難易度
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="level" class="form-control"
                name="level"
                v-model="model.selected_level">
          <option v-for="(level,key) in model.level_list()" :key="key">
            {{ level }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import Model from "../../models/model";

export default {
  name: "TableSelector",
  props: {
    model: {
      type: Model,
      required: true,
    }
  },
  data: () => ({
    selected: "",
  }),
  mounted() {
    this.selected = this.model.get_selected_table_name()
  },
  methods: {},
  watch: {
    selected: {
      handler() {
        this.$emit('setTable', this.selected);
      }
    },
  }
}
</script>

<style scoped>
#table_selector {
  margin-top: 5px;
  margin-bottom: 5px;
}

</style>