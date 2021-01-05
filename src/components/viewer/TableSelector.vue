<template>
  <div id="table_selector">
    <h6 class="sidebar-title" @click="selector_visible">
      難易度表選択{{ show ? "▼" : "▶" }}
    </h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <label>
          <select class="form-control table-listbox" name="table" v-model="selected">
            <option v-for="(name,index) in model.get_table_names()" :key="index">{{ name }}</option>
          </select>
        </label>
      </div>
    </transition>
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
    show: true,
  }),
  mounted() {
    this.selected = this.model.get_selected_table_name()
  },
  methods: {
    selector_visible() {
      this.show = !this.show;
    },
  },
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
  width: 320px;
  box-sizing: border-box
}

.table-listbox {
  height: 100%;
  width: 100%;
}
</style>