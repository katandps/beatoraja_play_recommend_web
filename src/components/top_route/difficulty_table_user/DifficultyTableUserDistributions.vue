<script setup lang="ts">
import { computed } from "vue"
import SongDetail from "@/models/song_detail"
import {
    buildClearEffortByLevel,
    buildClearEffortCountByLevel,
    buildLampCountsByLevel,
    buildScoreEffortByLevel,
    buildScoreEffortCountByLevel,
    buildScoreRateBinsByLevel,
    formatEffort,
    lampIndexDisplay,
    lampIndexMap,
    rankBoundaryLabels,
    totalBins
} from "@/models/difficultyTableUser"

const props = defineProps<{
    tableSongs: SongDetail[]
    baseLevels: string[]
}>()

const lampCountsByLevel = computed(() =>
    buildLampCountsByLevel(props.tableSongs, props.baseLevels)
)
const scoreRateBinsByLevel = computed(() =>
    buildScoreRateBinsByLevel(props.tableSongs, props.baseLevels)
)
const scoreEffortByLevel = computed(() => buildScoreEffortByLevel(props.tableSongs))
const scoreEffortCountByLevel = computed(() => buildScoreEffortCountByLevel(props.tableSongs))
const clearEffortByLevel = computed(() => buildClearEffortByLevel(props.tableSongs))
const clearEffortCountByLevel = computed(() => buildClearEffortCountByLevel(props.tableSongs))
</script>

<template>
    <section class="panel-grid">
        <div class="panel-box">
            <h3>ランプ分布</h3>
            <div class="lamp-header">
                <span>Level</span>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
            <div class="lamp-level-list">
                <div v-for="row in lampCountsByLevel" :key="row.level" class="lamp-level-row">
                    <div class="lamp-level-name" v-tooltip="{
                        content: `クリア頑張り度 合計 ${formatEffort(clearEffortByLevel[row.level] || 0)} / 平均 ${formatEffort((clearEffortByLevel[row.level] || 0) / Math.max(1, clearEffortCountByLevel[row.level] || 0))}`,
                        delay: { show: 0, hide: 0 }
                    }">
                        {{ row.level }}
                    </div>
                    <div class="lamp-stack" role="img" :aria-label="`ランプ分布 ${row.level}`">
                        <div v-for="lamp in lampIndexDisplay" :key="lamp" class="lamp-segment" :class="`bg-${lamp}`"
                            :style="{ width: ((row.counts[lampIndexMap[lamp]] / row.total) * 100) + '%' }"
                            :title="`${lamp}: ${row.counts[lampIndexMap[lamp]]}`"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-box">
            <h3>スコアレート分布</h3>
            <div v-if="scoreRateBinsByLevel.length" class="rate-summary">
                <div class="rate-header">
                    <span>Level</span>
                    <div class="rate-boundary-labels" :style="{ '--bins': totalBins }">
                        <span v-for="(rank, index) in rankBoundaryLabels" :key="rank.label" class="rate-boundary-label"
                            :class="{ 'is-first': index === 0, 'is-last': index === rankBoundaryLabels.length - 1 }"
                            :style="{ left: rank.left }">
                            {{ rank.label }}
                        </span>
                    </div>
                </div>
                <div v-for="row in scoreRateBinsByLevel" :key="row.level" class="rate-row">
                    <div class="rate-name" v-tooltip="{
                        content: `スコア頑張り度 合計 ${formatEffort(scoreEffortByLevel[row.level] || 0)} / 平均 ${formatEffort((scoreEffortByLevel[row.level] || 0) / Math.max(1, scoreEffortCountByLevel[row.level] || 0))}`,
                        delay: { show: 0, hide: 0 }
                    }">
                        {{ row.level }}
                    </div>
                    <div class="rate-heat" role="img" :aria-label="`スコアレート分布 ${row.level}`"
                        :style="{ '--bins': totalBins }">
                        <span v-for="(segment, index) in row.segments" :key="index" class="rate-bin"
                            :class="[segment.rank ? `bg-${segment.rank}` : '', segment.count === 0 ? 'is-empty' : '']"
                            :style="{ '--alpha': segment.alpha.toFixed(3), '--span': segment.len }" v-tooltip="segment.count === 0
                                ? undefined
                                : {
                                    content: `${segment.startPercent.toFixed(1)}% (${segment.rank}): ${segment.count}`,
                                    delay: { show: 0, hide: 0 }
                                }"></span>
                    </div>
                </div>
            </div>
            <div v-else class="empty-state">スコアレートの対象データがありません</div>
        </div>
    </section>
</template>

<style scoped>
.panel-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    margin-bottom: 20px;
    --dist-bar-height: 16px;
}

.panel-box {
    background: var(--panel);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid #f1eeea;
    animation: rise 720ms ease both;
}

.rate-summary {
    display: grid;
    gap: 10px;
    margin-top: 8px;
}

.lamp-level-list {
    display: grid;
    gap: 10px;
    margin-top: 8px;
}

.lamp-level-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 10px;
    align-items: center;
    font-size: 0.9rem;
}

.lamp-level-name {
    font-weight: 600;
    color: #3a3a44;
    font-size: 0.9rem;
}

.lamp-header {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1fr;
    gap: 10px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-top: 8px;
}

.lamp-header span:nth-child(2) {
    justify-self: start;
}

.lamp-header span:nth-child(3) {
    justify-self: center;
}

.lamp-header span:nth-child(4) {
    justify-self: end;
}

.lamp-stack {
    display: flex;
    height: var(--dist-bar-height);
    border-radius: 0;
    overflow: hidden;
    margin-top: 0;
    background: #eee6de;
    border: 1px solid #e7dfd7;
    position: relative;
}

.lamp-stack::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(to right,
            transparent 0,
            transparent calc(100% / 10 - 1px),
            rgba(0, 0, 0, 0.18) calc(100% / 10 - 1px),
            rgba(0, 0, 0, 0.18) calc(100% / 10));
    pointer-events: none;
}

.lamp-segment {
    height: 100%;
}

.lamp-segment.bg-ExHard {
    background: linear-gradient(135deg, #ffe3a1 0%, #fff3c9 45%, #ffd27a 100%) !important;
}

.lamp-segment.bg-FullCombo {
    background: linear-gradient(135deg, #9ff0f0 0%, #c9fbff 45%, #78dbe6 100%) !important;
}

.lamp-segment.bg-Perfect {
    background: linear-gradient(135deg, #d0d0ff 0%, #ece9ff 45%, #b0b0ff 100%) !important;
}

.lamp-segment.bg-Max {
    background: linear-gradient(135deg, #f0f0ff 0%, #d8dcff 45%, #bfc6ff 100%) !important;
}

.rate-row {
    display: grid;
    gap: 10px;
    align-items: center;
    font-size: 0.9rem;
    grid-template-columns: 80px 1fr;
}

.rate-name {
    font-weight: 600;
    color: #3a3a44;
}

.rate-header {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 10px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
}

.rate-boundary-labels {
    position: relative;
    height: 1em;
}

.rate-boundary-label {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    white-space: nowrap;
}

.rate-boundary-label.is-first {
    transform: translateX(0);
}

.rate-boundary-label.is-last {
    transform: translateX(-100%);
}

.rate-heat {
    display: grid;
    grid-template-columns: repeat(var(--bins, 90), minmax(0, 1fr));
    gap: 0;
    height: var(--dist-bar-height);
    background: #646464;
    border: 1px solid #555555;
    position: relative;
}

.rate-heat::before {
    content: "";
    position: absolute;
    inset: 0;
    width: calc((var(--bins, 90) - 1) / var(--bins, 90) * 100%);
    background-image: linear-gradient(to right,
            rgba(255, 255, 255, 0.18) 0,
            rgba(255, 255, 255, 0.18) 1px,
            transparent 1px);
    background-size: calc(100% * 5 / (var(--bins, 90) - 1)) 100%;
    background-repeat: repeat;
    pointer-events: none;
}

.rate-bin {
    background: #9aa5b1;
    opacity: var(--alpha);
    grid-column: span var(--span, 1);
}

.rate-bin.is-empty {
    background: transparent !important;
    opacity: 0 !important;
}

.rate-legend .legend-dot.bg-AAA,
.rate-heat .rate-bin.bg-AAA {
    background: linear-gradient(135deg, #f9e08b 0%, #f6f0c4 45%, #e0b84f 100%) !important;
    box-shadow: inset 0 0 0 1px rgba(255, 230, 160, 0.7), 0 0 6px rgba(235, 190, 90, 0.35) !important;
}

.rate-legend .legend-dot.bg-AA,
.rate-heat .rate-bin.bg-AA {
    background: linear-gradient(135deg, #e5e7ea 0%, #f5f7f9 45%, #b8c0c8 100%) !important;
    box-shadow: inset 0 0 0 1px rgba(235, 240, 245, 0.7), 0 0 6px rgba(160, 175, 190, 0.35) !important;
}

.rate-legend .legend-dot.bg-A,
.rate-heat .rate-bin.bg-A {
    background: linear-gradient(135deg, #e5b27a 0%, #f2d1a6 45%, #b56d2b 100%) !important;
    box-shadow: inset 0 0 0 1px rgba(240, 205, 165, 0.7), 0 0 6px rgba(190, 120, 60, 0.35) !important;
}

.rate-heat .rate-bin.bg-Max {
    background: linear-gradient(135deg, #f7f3ff 0%, #e3e4ff 40%, #c6c9ff 70%, #9ea6ff 100%) !important;
    box-shadow: inset 0 0 0 1px rgba(210, 214, 255, 0.9), 0 0 10px rgba(120, 140, 255, 0.55) !important;
    position: relative;
    overflow: hidden;
}

.rate-heat .rate-bin.bg-Max::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.75) 35%,
            transparent 65%);
    opacity: 0.8;
    pointer-events: none;
}

.empty-state {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f1f0f4;
    color: #6a6a78;
    font-size: 0.9rem;
}
</style>
