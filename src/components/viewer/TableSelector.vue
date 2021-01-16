<template>
  <div id="table_selector" class="form-inline">
    <label for="selector">
      難易度表:
    </label>
    <select id="selector" class="form-control table-input-form" name="table"
            v-model="selected">
      <option v-for="(name,index) in model.get_table_names()" :key="index">
        {{ name }}
      </option>
    </select>
    <label for="level_selector" class="level-selector-label">難易度:</label>
    <select id="level_selector" class="level-selector form-control" name="level"
            v-model="model.selected_level">
      <option v-for="(level,key) in model.get_selected_table().level_list"
              :key="key">{{ level }}
      </option>
    </select>
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

.table-input-form {
  margin-left: 20px;
}

.level-selector {
  margin-left: 20px;
}

.level-selector-label {
  margin-left: 20px;
}

</style>