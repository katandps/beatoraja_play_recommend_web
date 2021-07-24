<template>
  <div id="table_selector">
    <div class="row align-items-center">
      <div class="input-group col-sm-5" role="group" aria-label="Difficulty Table">
        <div class="input-group-prepend">
          <label for="table" class="btn btn-info text-nowrap" v-tooltip="'表示する難易度表'">
            難易度表
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="table" class="form-control" name="table" v-model="selected">
          <option v-for="(name,index) in model.get_table_names()" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
      <div class="input-group col-sm-4" role="group" v-if="can_level_select">
        <div class="input-group-prepend">
          <label for="all_list" class="btn btn-info text-nowrap" v-tooltip="'難易度表に登録されているすべてのレベルを表示対象にします'">
            全難易度表示
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <input class="form-control" type="checkbox" id="all_list" v-model="visible_all_levels">
      </div>
      <div class="input-group col-sm-3" role="group" aria-label="Difficulty"
           v-if="can_level_select && !visible_all_levels">
        <div class="input-group-prepend">
          <label for="level" class="btn btn-info text-nowrap" v-tooltip="'詳細表で表示する難易度'">
            難易度
            <font-awesome-icon :icon="['fas', 'question-circle']"/>
          </label>
        </div>
        <select id="level" class="form-control" name="level" v-model="model.selected_level">
          <option v-for="(level,key) in model.level_list()" :key="key">
            {{ level }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import Model from "../../../../models/model"

export default {
  name: "TableSelector",
  props: {
    model: {
      type: Model,
      required: true,
    },
    can_level_select: {
      type: Boolean,
      required: false,
    }
  },
  data: () => ({
    selected: "",
    visible_all_levels: false,
  }),
  beforeMount() {
    this.visible_all_levels = this.$store.state.filter.visible_all_levels
  },
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
    visible_all_levels: {
      handler() {
        this.$store.commit('setVisibleAllLevelsFlag', this.visible_all_levels)
      }
    }
  }
}
</script>
