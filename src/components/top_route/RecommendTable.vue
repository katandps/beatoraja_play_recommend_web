<script setup lang="ts">
import Api from "../../api"
import { computed, onMounted, ref } from "vue"
import { useLoginStore } from '@/store/session'

const store = useLoginStore()

interface Props {
  user_id: number
}
const props = defineProps<Props>()

const tables = ref()
const selected = ref()

onMounted(() => {
  Api.fetch_tables(store.accessToken).then(
    t => {
      tables.value = t
      selected.value = t.first()?.name
    }
  )
})

// --- computed ---
const list = computed(() => tables.value ? tables.value.name_list() : [])
const url = computed(() => {
  if (tables.value && tables.value.table_index(selected.value) >= 0) {
    return Api.get_table_header_url(props.user_id, tables.value.table_index(selected.value))
  } else {
    return "難易度表を選択してください"
  }
})
</script>

<template>
  <div id="recommend-table">
    <h2>おすすめ譜面表</h2>
    難易度ごとにプレイ日時が古そうな曲をピックアップして難易度表にします。
    <div class="input-group col-sm-12" role="group" aria-label="Difficulty Table">
      <div class="input-group-prepend">
        <label for="table" class="btn btn-info text-nowrap" v-tooltip="'表示する難易度表'">
          難易度表
          <font-awesome-icon :icon="['fas', 'question-circle']" />
        </label>
      </div>
      <select id="table" class="form-control" name="table" v-model="selected">
        <option v-for="(name, index) in list" :key="index">
          {{ name }}
        </option>
      </select>
    </div>
    下記URLをbeatorajaに追加して下さい。<br />
    <div class="form-group row align-items-center">
      <div class="btn-group col-sm-12">
        <label for="url_box"></label>
        <input id="url_box" class="form-control" type="text" :value="url" disabled>
      </div>
    </div>
  </div>
</template>

<style scoped>
#recommend-table {
  padding-top: 20px;
  max-width: 800px;
  margin: 0 auto 0 auto;
}
</style>