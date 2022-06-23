<script setup lang="ts">
import ModalBase, { IModalBase } from "./ModalBase.vue"
import { ref, computed, watch } from "vue"
import config from "../../../../const"
import Columns from "@/models/columns"

export interface IColumnModal {
  showModal: () => void
}

// --- ref ---
const modal_base = ref<IModalBase>()

// --- props ---
interface Props {
  columns: Columns
}
const props = defineProps<Props>()

// --- data ---
const columns = ref(props.columns?.visible_columns())

// --- computed ---
const column_list = computed(() =>
  config.DETAIL_COLUMNS.filter((c) => c.key !== "title")
)

// --- methods ---
const showModal = () => modal_base.value?.showModal()
const closeModal = () => modal_base.value?.closeModal()

watch(columns, (cur) => props.columns?.import_columns(cur))

// --- expose ---
defineExpose({ showModal })
</script>

<template>
  <modal-base id="column-modal" ref="modal_base">
    <template v-slot:header>
      <h2>表示カラム設定</h2>
    </template>
    <template v-slot:body>
      <div id="detail-columns" class="form-group row align-items-center">
        <div v-for="obj in column_list" :key="obj.key" class="btn col-sm-3 text-nowrap">
          <input type="checkbox" :id="obj.key" v-model="columns" :value="obj.key" />

          <label :for="obj.key">
            {{ obj.name }}
          </label>
        </div>
      </div>
      <hr />
      <div class="btn" @click="closeModal">閉じる</div>
    </template>
  </modal-base>
</template>
