<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import SongDetail, { Log } from '@/models/song_detail'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  logs: Log[]
  song: SongDetail
}
const props = defineProps<Props>()

const activeTab = ref('score')

// Chart.jsインスタンスの参照を保持
const chartRefs = ref<{ [key: string]: any }>({})

const formatDateLabel = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTooltipDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 前回値と異なる場合にマークを付けるためのユーティリティ
function getMarkArray(arr: Array<number | null>, nullValue: number | null = null) {
  const marks: boolean[] = []
  let prev: number | null = null
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i]
    if (val === nullValue) {
      marks.push(false)
      prev = null
      continue
    }
    if (prev === null) {
      marks.push(true) // 最初の値は常にマーク
      prev = val
      continue
    }
    if (val !== prev) {
      marks.push(true)
    } else {
      marks.push(false)
    }
    prev = val
  }
  return marks
}

const scoreData = computed(() => {
  const scores = props.logs.map(log => log.score)
  const marks = getMarkArray(scores)
  return {
    labels: props.logs.map(log => formatDateLabel(log.updated_at)),
    datasets: [{
      label: 'スコア',
      data: scores,
      borderColor: '#0066ff',
      backgroundColor: 'rgba(0, 102, 255, 0.1)',
      tension: 0,
      pointRadius: marks.map(mark => mark ? 6 : 4),
      pointHoverRadius: 8,
      pointStyle: marks.map(mark => mark ? 'circle' : 'circle'),
      // mark時は色も変える例: 赤
      pointBackgroundColor: marks.map(mark => mark ? '#0066ff' : '#ffffff ')
    }]
  }
})

const bpData = computed(() => {
  const bps = props.logs.map(log => log.min_bp === -1 ? null : log.min_bp)
  const marks = getMarkArray(bps, null)
  return {
    labels: props.logs.map(log => formatDateLabel(log.updated_at)),
    datasets: [{
      label: 'ミス数',
      data: bps,
      borderColor: '#ff3333',
      backgroundColor: 'rgba(255, 51, 51, 0.1)',
      tension: 0,
      pointRadius: marks.map(mark => mark ? 6 : 4),
      pointHoverRadius: 8,
      pointStyle: marks.map(mark => mark ? 'circle' : 'circle'),
      pointBackgroundColor: marks.map(mark => mark ? '#ff3333' : '#ffffff'),
      spanGaps: true
    }]
  }
})

const comboData = computed(() => {
  const combos = props.logs.map(log => log.max_combo)
  const marks = getMarkArray(combos)
  return {
    labels: props.logs.map(log => formatDateLabel(log.updated_at)),
    datasets: [{
      label: '最大コンボ',
      data: combos,
      borderColor: '#00cc44',
      backgroundColor: 'rgba(0, 204, 68, 0.1)',
      tension: 0,
      pointRadius: marks.map(mark => mark ? 6 : 4),
      pointHoverRadius: 8,
      pointStyle: marks.map(mark => mark ? 'circle' : 'circle'),
      pointBackgroundColor: marks.map(mark => mark ? '#00cc44' : '#ffffff')
    }]
  }
})

const createChartOptions = (yAxisTitle: string, maxValue?: number) => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 50
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#48CAE4',
      borderWidth: 1,
      callbacks: {
        title: (tooltipItems: any[]) => {
          const index = tooltipItems[0].dataIndex
          return formatTooltipDate(props.logs[index].updated_at)
        },
        afterBody: (tooltipItems: any[]) => {
          const index = tooltipItems[0].dataIndex
          const log = props.logs[index]
          return [
            `クリア: ${log.clear_type}`,
            `スコア: ${log.score.toLocaleString()}`,
            `ミス: ${log.min_bp === -1 ? '未記録' : log.min_bp}`,
            `コンボ: ${log.max_combo.toLocaleString()}`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '更新日',
        color: '#666'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      title: {
        display: true,
        text: yAxisTitle,
        color: '#666'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      min: 0,
      ...(maxValue && { max: maxValue }),
      ticks: {
        callback: (value: any) => {
          if (yAxisTitle === 'ミス数' && value === -1) return 'N/A'
          return Number(value).toLocaleString()
        }
      }
    }
  }
})

const scoreOptions = computed(() =>
  createChartOptions('スコア', props.song.total_notes * 2)
)

const bpOptions = computed(() =>
  createChartOptions('ミス数')
)

const comboOptions = computed(() =>
  createChartOptions('最大コンボ', props.song.total_notes)
)

// コンポーネント破棄時にChart.jsインスタンスをクリーンアップ
onBeforeUnmount(() => {
  Object.values(chartRefs.value).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy()
    }
  })
})
</script>

<template>
  <div id="logchart">
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'score' }" @click="activeTab = 'score'">
          スコア更新グラフ
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'bp' }" @click="activeTab = 'bp'">
          ミスカウント更新グラフ
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'combo' }" @click="activeTab = 'combo'">
          最大コンボ数更新グラフ
        </button>
      </li>
    </ul>

    <div class="chart-container">
      <div v-show="activeTab === 'score'" class="chart-wrapper">
        <h4 class="text-center mb-3">スコア</h4>
        <Line :key="'score-' + props.logs.length" :data="scoreData" :options="scoreOptions" ref="scoreChart" />
      </div>

      <div v-show="activeTab === 'bp'" class="chart-wrapper">
        <h4 class="text-center mb-3">ミスカウント</h4>
        <Line :key="'bp-' + props.logs.length" :data="bpData" :options="bpOptions" ref="bpChart" />
      </div>

      <div v-show="activeTab === 'combo'" class="chart-wrapper">
        <h4 class="text-center mb-3">最大コンボ</h4>
        <Line :key="'combo-' + props.logs.length" :data="comboData" :options="comboOptions" ref="comboChart" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
}

.chart-wrapper {
  height: 100%;
  width: 100%;
}

.nav-tabs .nav-link {
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
}

.nav-tabs .nav-link.active {
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
}
</style>