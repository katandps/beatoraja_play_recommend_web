<script setup lang="ts">
import config from "../../../const"
import SongDetail from "../../../models/song_detail"
import SongListModalVue, { ISongListModal } from "./modal/SongListModal.vue"
import { ref, computed } from "vue"
import Tables, { ActivatedTables } from "@/models/difficultyTable"
import { useFilterStore } from "@/store/filter"

const filterStore = useFilterStore()
interface Props {
  filtered_score: SongDetail[]
  exists_rival_score: boolean
  tables: Tables
  checks: ActivatedTables
}
const props = defineProps<Props>()

// --- refs ---
const modal = ref<ISongListModal>()

// --- computed ---
const lamp_list = computed(() =>
  active_tables.value.map((table) =>
    table.level_list.map((l) =>
      config.LAMP_INDEX.map((_lamp, index) =>
        props.filtered_score
          .filter(
            (s: SongDetail) =>
              s.clear_type === index && s.get_levels().indexOf(l) !== -1
          )
          .sort(SongDetail.cmp_title)
      )
    )
  )
)
const rival_lamp_list = computed(
  () => {
    if (props.exists_rival_score) {
      return active_tables.value.map((table) =>
        table.level_list.map((l) =>
          config.LAMP_INDEX.map((_lamp, index) =>
            props.filtered_score
              .filter(
                (s: SongDetail) =>
                  s.rival_clear_type === index &&
                  s.get_levels().indexOf(l) !== -1
              )
              .sort(SongDetail.cmp_title)
          )
        )
      )
    } else {
      return []
    }
  }
)
const active_tables = computed(() => ActivatedTables.filter_active_tables(props.checks, props.tables))

// --- methods ---
const showModal = (title: string, text: SongDetail[]) =>
  modal.value?.showModal(title, text)

const list = (table_index: number, level_index: number, rank_index: number) => {
  return lamp_list.value[table_index][level_index][rank_index]
    .sort(SongDetail.cmp_title)
}
</script>

<template>
  <div id="lamp-graph">
    凡例
    <div style="width: 100%">
      <div>
        <div class="progress" style="width: 100%; height: 1.8em">
          <div v-for="clear_type in config.LAMP_TYPE" :key="clear_type" :class="'progress-bar bg-' + clear_type"
            role="progressbar" style="color: #000000" :style="'width: ' + 100.0 / config.LAMP_TYPE.length + '%'">
            <span>{{ clear_type }}
              <font-awesome-icon :icon="['fas', 'circle-exclamation']"
                v-if="!filterStore.filter.visible_lamp.visible(clear_type)" v-tooltip="'非表示中です'" />
            </span>

          </div>
        </div>
      </div>
    </div>
    <hr />
    <template v-if="active_tables.length > 0">
      <div v-for="(table, table_index) in active_tables" :key="table_index">
        <h2>{{ table.name }}</h2>
        <div class="lamp-table-grid" :class="{ 'lamp-table-grid-with-rival': exists_rival_score }">
          <div v-for="(level, level_index) in table.level_list" :key="level_index" class="lamp-row">
            <div class="lamp-label">{{ level }}</div>
            <!-- 自分のグラフ -->

            <div class="progress" :class="exists_rival_score ? 'lamp-progress-with-rival' : 'lamp-progress'">
              <div v-for="lamp_index in config.LAMP_GRAPH_LIST" :key="config.LAMP_INDEX[lamp_index]"
                :class="'progress-bar bg-' + config.LAMP_INDEX[lamp_index]" role="progressbar" :style="'width: ' +
                  lamp_list[table_index][level_index][lamp_index].length * 100 +
                  '%;color:#000'
                  " v-on:click="
                    showModal(
                      level + ' ' + config.LAMP_INDEX[lamp_index],
                      list(table_index, level_index, lamp_index)
                    )
                    ">
                {{ lamp_list[table_index][level_index][lamp_index].length }}
              </div>
            </div>
            <!-- 自分のグラフここまで -->

            <!-- ライバルのグラフ -->
            <div class="progress lamp-progress-with-rival" v-if="exists_rival_score">
              <div v-for="lamp_index in config.LAMP_GRAPH_LIST" :key="config.LAMP_INDEX[lamp_index]"
                :class="'progress-bar bg-' + config.LAMP_INDEX[lamp_index]" role="progressbar" :style="'width: ' +
                  rival_lamp_list[table_index][level_index][lamp_index].length * 100 +
                  '%;color:#000'
                  " v-on:click="
                    showModal(
                      level + ' ' + config.LAMP_INDEX[lamp_index],
                      list(table_index, level_index, lamp_index)
                    )
                    ">
                {{ rival_lamp_list[table_index][level_index][lamp_index].length }}
              </div>
            </div>
            <!-- ライバルのグラフここまで-->
          </div>
        </div>
      </div>
    </template>
    <template v-else>表示する難易度が設定されていません</template>
    <SongListModalVue id="song-list-modal" ref="modal" />
  </div>
</template>

<style scoped>
.lamp-table-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 8px;
  row-gap: 2px;
  margin-bottom: 1em;
  align-items: center;
}

.lamp-table-grid-with-rival {
  grid-template-columns: max-content 1fr 1fr;
}

.lamp-row {
  display: contents;
}

.lamp-label {
  white-space: nowrap;
}

.lamp-progress {
  width: 100%;
  min-width: 0;
  height: 2em;
}

.lamp-progress-with-rival {
  width: 100%;
  min-width: 0;
  height: 2em;
}

.progress-bar {
  cursor: pointer;
}
</style>
