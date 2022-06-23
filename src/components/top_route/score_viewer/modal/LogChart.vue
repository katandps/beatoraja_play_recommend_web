<script setup lang="ts">
import { Chart, Grid, Line, Tooltip } from "vue3-charts"
import SongDetail, { Log } from "@/models/song_detail"
import { ref } from "vue";

interface Props {
  logs: Log[],
  song: SongDetail
}
const props = defineProps<Props>()

const direction = ref("horizontal")
const margin = ref({
  left: 0,
  top: 20,
  right: 20,
  bottom: 0
})
const scoreAxis = ref({
  primary: {
    format: () => "",
  },
  secondary: {
    domain: [0, props.song.total_notes * 2],
    ticks: 20,
  }
})
const bpAxis = ref({
  primary: {
    format: () => "",
  },
  secondary: { ticks: 20 }
})
const comboAxis = ref({
  primary: {
    format: () => ""
  },
  secondary: {
    domain: [0, props.song.total_notes]
  }
})
const tooltipConfig = ref({
  clear_type: { label: 'Clear' },
  score: { label: 'Score', color: '#0000ff' },
  min_bp: { label: 'BP', color: '#ff0000' },
  max_combo: { lable: 'Combo', color: '#00ff00' },
  updated_at: { label: 'Date', }
})
const tab = ref('score')
</script>

<template>
  <div id="logchart">
    <div class="form-group row">
      <div class="col-sm-12">
        <div class="btn btn-outline-secondary col-sm-4 text-nowrap" @click="tab = 'score'">
          スコア遷移表示
        </div>
        <div class="btn btn-outline-secondary col-sm-4 text-nowrap" @click="tab = 'bp'">
          ミスカウント遷移表示
        </div>
        <div class="btn btn-outline-secondary col-sm-4 text-nowrap" @click="tab = 'combo'">
          最大コンボ数遷移表示
        </div>
      </div>
    </div>
    <div v-if="tab == 'score'">
      <h4>スコア遷移</h4>
      <Chart :data="logs" :margin="margin" :direction="direction" :axis="scoreAxis">
        <template #layers>
          <Grid strokeDashArray="2,2" />
          <Line :dataKeys="['updated_at', 'score']" :lineStyle="{ stroke: 'blue' }" />
        </template>
        <template #widgets>
          <Tooltip borderColor="#48CAE4" :config="tooltipConfig" />
        </template>
      </Chart>
    </div>
    <div v-if="tab == 'bp'">
      <h4>ミスカウント遷移</h4>
      <Chart :data="logs" :margin="margin" :direction="direction" :axis="bpAxis">
        <template #layers>
          <Grid strokeDashArray="2,2" />
          <Line :dataKeys="['updated_at', 'min_bp']" :lineStyle="{ stroke: 'red' }" />
        </template>
        <template #widgets>
          <Tooltip borderColor="#48CAE4" :config="tooltipConfig" />
        </template>
      </Chart>
    </div>
    <div v-if="tab == 'combo'">
      <h4>最大コンボ数遷移</h4>
      <Chart :data="logs" :margin="margin" :direction="direction" :axis="comboAxis">
        <template #layers>
          <Grid strokeDashArray="2,2" />
          <Line :dataKeys="['updated_at', 'max_combo']" :lineStyle="{ stroke: 'green' }" />
        </template>
        <template #widgets>
          <Tooltip borderColor="#48CAE4" :config="tooltipConfig" />
        </template>
      </Chart>
    </div>
  </div>
</template>