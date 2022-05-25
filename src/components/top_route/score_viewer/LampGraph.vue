<script setup lang="ts">
import config from "../../../const"
import SongDetail from "../../../models/song_detail"
import GraphModalVue, { IGraphModal } from "./modal/GraphModal.vue"
import { ref, computed } from "vue"
import Tables from "@/models/difficultyTable"

interface Props {
  filtered_score: SongDetail[]
  tables: Tables
}
const props = defineProps<Props>()

// --- refs ---
const modal = ref<IGraphModal>()

// --- computed ---
const lamp_list = computed(() =>
  active_tables.value.map((table) =>
    table.level_list.map((l) =>
      config.LAMP_INDEX.map((_lamp, index) =>
        props.filtered_score
          .filter((s) => s.clear_type === index && s.level === l)
          .sort(SongDetail.cmp_title)
      )
    )
  )
)
const active_tables = computed(() =>
  props.tables.tables.filter((t) => t.checks.length > 0)
)

// --- methods ---
const showModal = (title: string, text: string[]) =>
  modal.value?.showModal(title, text)

const list = (table_index: number, level_index: number, rank_index: number) => {
  return lamp_list.value[table_index][level_index][rank_index]
    .sort(SongDetail.cmp_title)
    .map((s) => s.title)
}
</script>

<template>
  <div id="lamp-graph">
    凡例
    <table style="width: 100%">
      <tr>
        <td class="progress" style="width: 100%; height: 1.8em">
          <div
            v-for="clear_type in config.LAMP_TYPE"
            :key="clear_type"
            :class="'progress-bar bg-' + clear_type"
            role="progressbar"
            style="color: #000000"
            :style="'width: ' + 100.0 / config.LAMP_TYPE.length + '%'"
          >
            {{ clear_type }}
          </div>
        </td>
      </tr>
    </table>
    <hr />
    <template v-if="active_tables.length > 0">
      <div v-for="(table, table_index) in active_tables" :key="table_index">
        <h2>{{ table.name }}</h2>
        <table style="width: 100%">
          <tr
            v-for="(level, level_index) in table.level_list"
            :key="level_index"
            style="width: 100%"
          >
            <td style="width: 30px">{{ level }}</td>
            <td class="progress" style="width: 100%; height: 1.8em">
              <div
                v-for="lamp_index in config.LAMP_GRAPH_LIST"
                :key="config.LAMP_INDEX[lamp_index]"
                :class="'progress-bar bg-' + config.LAMP_INDEX[lamp_index]"
                role="progressbar"
                :style="
                  'width: ' +
                  lamp_list[table_index][level_index][lamp_index].length * 100 +
                  '%;color:#000'
                "
                v-on:click="
                  showModal(
                    level + ' ' + config.LAMP_INDEX[lamp_index],
                    list(table_index, level_index, lamp_index)
                  )
                "
              >
                {{ lamp_list[table_index][level_index][lamp_index].length }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-else>表示する難易度が設定されていません</template>
    <GraphModalVue id="song-list-modal" ref="modal" />
  </div>
</template>

<style scoped>
.progress-bar {
  cursor: pointer;
}
</style>
