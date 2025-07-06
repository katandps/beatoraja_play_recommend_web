<script setup lang="ts">
import Api from "../../api"
import { computed, onMounted, Ref, ref } from "vue"
import { useLoginStore } from '@/store/session'
import Tables from "@/models/difficultyTable"

const store = useLoginStore()

interface Props {
  user_id: number
}
const props = defineProps<Props>()

const tables: Ref<Tables> = ref(Tables.default())
const selected_name: Ref<string> = ref("")

onMounted(() => {
  Api.fetch_tables(store.accessToken).then(
    t => {
      tables.value = t
      selected_name.value = ""
    }
  )
})

// --- computed ---
const list = computed(() => tables.value.name_list())
const url = computed(() => {
  if (tables.value && selected_name.value !== "") {
    return Api.get_table_header_url(props.user_id, tables.value.get_id_by_name(selected_name.value))
  } else {
    return url_default_value
  }
})
const url_default_value = "難易度表を選択してください"

const preview_table = ref()
const preview_header = ref()
const onChangeSelectedTable = () => {
  Api.get_table_header(props.user_id, tables.value.get_id_by_name(selected_name.value)).then(
    header => {
      preview_header.value = header
    }
  )
  Api.get_table(props.user_id, tables.value.get_id_by_name(selected_name.value)).then(
    table => {
      preview_table.value = table
    }
  )
}
</script>

<template>
  <div id="recommend-table">
    <h2 class="mb-2">おすすめ譜面表</h2>
    <p>beatorajaのプレイデータを元に、プレイ日時が古い曲をピックアップする難易度表を作成します。</p>
    <div class="mb-4">
      <h3>難易度表の指定</h3>
      <div class="input-group col-sm-12" role="group" aria-label="Difficulty Table">
        <div class="input-group-prepend">
          <label for="table" class="btn btn-info text-nowrap" v-tooltip="'作成元となる難易度表'">
            難易度表
            <font-awesome-icon :icon="['fas', 'question-circle']" />
          </label>
        </div>
        <select id="table" class="form-control" name="table" v-model="selected_name" @change="onChangeSelectedTable">
          <option v-for="(name, index) in list" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
    </div>
    <div class="mb-4">
      <h3>難易度表の登録</h3>
      <p>下記URLをbeatorajaに追加して下さい。</p>
      <div class="form-group row align-items-center">
        <div class="btn-group col-sm-12">
          <label for="url_box"></label>
          <input id="url_box" class="form-control" type="text" :value="url" disabled>
        </div>
      </div>
    </div>
    <div id="preview" class="container">
      <h3>プレビュー</h3>
      <p>難易度表のプレビューです。<br />スコア情報や元となる難易度表に更新があれば、おすすめされる曲目が変化します。</p>

      <div v-if="preview_header && preview_table" class="table-responsive">
        <h4>{{ preview_header.name }}</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Title</th>
              <th>Artist</th>
              <!-- <th>md5</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in preview_table" :key="index">
              <td>{{ row.level }}</td>
              <td>{{ row.title }}</td>
              <td>{{ row.artist }}</td>
              <!-- <td>{{ row.md5 }}</td> -->
            </tr>
          </tbody>
        </table>
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