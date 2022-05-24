<script setup lang="ts">
import ModalBase from "./ModalBase.vue"
import { ref, computed, watch } from "vue"
import SongFilter from "@/models/songFilter"
import config from "../../../../const"

// --- ref ---
const modal_base = ref(null)

// --- props ---
const props = defineProps({
  filter: { type: SongFilter, require: true }
})

// --- data ---
const columns = ref(props.filter?.visible_columns())

// --- computed ---
const column_list = computed(() =>
  config.DETAIL_COLUMNS.filter((c) => c.key !== "title")
)

// --- methods ---
const showModal = () => modal_base.value.show_modal()
const closeModal = () => modal_base.value.close_modal()

watch(columns, (cur) => props.filter?.columns.import_columns(cur))

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
        <div
          v-for="obj in column_list"
          :key="obj.key"
          class="btn col-sm-3 text-nowrap"
        >
          <input
            type="checkbox"
            :id="obj.key"
            v-model="columns"
            :value="obj.key"
          />

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
