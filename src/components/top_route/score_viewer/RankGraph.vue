<script setup lang="ts">
import config from "../../../const"
import SongDetail from "../../../models/song_detail"
import { computed, ref } from "vue"
import Tables, { ActivatedTables } from "@/models/difficultyTable"
import SongListModalVue, { ISongListModal } from "./modal/SongListModal.vue"
import { useFilterStore } from "@/store/filter"

const filterStore = useFilterStore()

interface Props {
  filtered_score: SongDetail[]
  tables: Tables
  checks: ActivatedTables
}
const props = defineProps<Props>()

// --- refs ---
const modal = ref<ISongListModal>()
// --- computed ---
const rank_list = computed(() =>
  active_tables.value.map((table) =>
    table.level_list.map((l) =>
      config.RANK_TYPE.map((r) =>
        props.filtered_score
          .filter((s) => s.clear_rank === r && s.level === l)
          .sort(SongDetail.cmp_title)
      )
    )
  )
)

const active_tables = computed(() => ActivatedTables.filter_active_tables(props.checks, props.tables))
// --- methods ---
const showModal = (title: string, text: SongDetail[]) =>
  modal.value?.showModal(title, text)

const list = (table_index: number, level_index: number, rank_index: number) =>
  rank_list.value[table_index][level_index][rank_index]
    .sort(SongDetail.cmp_title)
</script>

<template>
  <div id="rank-graph">
    凡例
    <div style="width: 100%">
      <div>
        <div class="progress" style="width: 100%; height: 1.8em">
          <div v-for="rank in config.RANK_TYPE" :key="rank" :class="'progress-bar bg-' + rank" role="progressbar"
            style="color: #000" :style="'width: ' + 100.0 / config.RANK_TYPE.length + '%'">
            <span>{{ rank }}
              <font-awesome-icon :icon="['fas', 'circle-exclamation']"
                v-if="!filterStore.filter.visible_rank.ranks[rank]" v-tooltip="'非表示中です'" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <template v-if="active_tables.length > 0">
      <div v-for="(table, table_index) in active_tables" :key="table_index">
        <h2>{{ table.name }}</h2>
        <div class="rank-table-grid">
          <div v-for="(level, level_index) in table.level_list" :key="level_index" class="rank-row">
            <div class="rank-label">{{ level }}</div>
            <div class="progress rank-progress">
              <div v-for="(rank, rank_index) in config.RANK_TYPE" :key="rank" :class="'progress-bar bg-' + rank"
                role="progressbar" :style="'width: ' +
                  rank_list[table_index][level_index][rank_index].length * 100 +
                  '%;color:#000'
                  " v-on:click="
                    showModal(
                      level + ' ' + rank,
                      list(table_index, level_index, rank_index)
                    )
                    ">
                {{ rank_list[table_index][level_index][rank_index].length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else> 表示する難易度が設定されていません </template>

    <SongListModalVue id="song-list-modal" ref="modal" />
  </div>
</template>

<style scoped>
.rank-table-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 8px;
  row-gap: 2px;
  align-items: center;
  margin-bottom: 1em;
  width: 100%;
}

.rank-row {
  display: contents;
}

.rank-label {
  white-space: nowrap;
}

.rank-progress {
  width: 100%;
  min-width: 0;
  height: 2em;
}

.progress-bar {
  cursor: pointer;
}
</style>
