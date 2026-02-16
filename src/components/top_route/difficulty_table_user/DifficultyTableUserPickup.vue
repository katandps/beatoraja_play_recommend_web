<script setup lang="ts">
import { computed } from "vue"
import SongDetail from "@/models/song_detail"
import { buildTopUpdates, easyIndex } from "@/models/difficultyTableUser"

const props = defineProps<{
    tableSongs: SongDetail[]
}>()

const topUpdates = computed(() => buildTopUpdates(props.tableSongs, easyIndex))
</script>

<template>
    <section class="panel-box pickup-panel">
        <div class="panel-header">
            <h3 v-tooltip="{ content: '30日以内の更新', delay: { show: 0, hide: 0 } }">ランプ更新ピックアップ</h3>
        </div>
        <div v-if="topUpdates.length" class="top-updates">
            <div v-for="row in topUpdates" :key="row.title" class="update-row">
                <div class="update-level">{{ row.level }}</div>
                <div class="update-title">{{ row.title }}</div>
                <div class="update-meta">
                    <span class="lamp-pill" :class="`lamp-${row.lamp}`">{{ row.lamp }}</span>
                    <span class="update-date">{{ row.updatedLabel }}</span>
                </div>
            </div>
        </div>
        <div v-else class="empty-state">最近の更新はありません</div>
    </section>
</template>

<style scoped>
.panel-box {
    background: var(--panel);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid #f1eeea;
    animation: rise 720ms ease both;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.top-updates {
    display: grid;
    gap: 10px;
    margin-top: 12px;
}

.update-row {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border-radius: 8px;
    background: #f6f2ee;
}

.update-level {
    font-weight: 600;
    color: #3a3a44;
}

.pickup-panel .panel-header {
    justify-content: center;
}

.update-title {
    font-weight: 600;
}

.update-meta {
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.update-date {
    font-weight: 600;
}

.empty-state {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f1f0f4;
    color: #6a6a78;
    font-size: 0.9rem;
}

.lamp-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.lamp-Failed {
    background: #f4d2d2;
    color: #9c2f2f;
}

.lamp-NoPlay {
    background: #e5e5e5;
    color: #5a5a5a;
}

.lamp-AssistEasy {
    background: #c6c6ff;
    color: #2d2d6a;
}

.lamp-LightAssistEasy {
    background: #ffc6ff;
    color: #6a2d6a;
}

.lamp-Easy {
    background: #d7f7d6;
    color: #1e6a2a;
}

.lamp-Normal {
    background: #ffe8b7;
    color: #9a5b00;
}

.lamp-Hard {
    background: #ffd6d6;
    color: #b22828;
}

.lamp-ExHard {
    background: linear-gradient(135deg, #ffe3a1 0%, #fff3c9 45%, #ffd27a 100%);
    color: #8a4b00;
    box-shadow: 0 0 0 1px rgba(255, 215, 120, 0.7), 0 4px 10px rgba(255, 180, 60, 0.28);
    position: relative;
    overflow: hidden;
}

.lamp-ExHard::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 35%,
            transparent 65%);
    opacity: 0.7;
    pointer-events: none;
}

.lamp-FullCombo {
    background: linear-gradient(135deg, #9ff0f0 0%, #c9fbff 45%, #78dbe6 100%);
    color: #00545c;
    box-shadow: 0 0 0 1px rgba(120, 219, 230, 0.6), 0 4px 10px rgba(80, 180, 190, 0.25);
    position: relative;
    overflow: hidden;
}

.lamp-Perfect {
    background: linear-gradient(135deg, #d0d0ff 0%, #ece9ff 45%, #b0b0ff 100%);
    color: #2e2e6d;
    box-shadow: 0 0 0 1px rgba(176, 176, 255, 0.6), 0 4px 10px rgba(130, 130, 220, 0.25);
    position: relative;
    overflow: hidden;
}

.lamp-Max {
    background: linear-gradient(135deg, #f0f0ff 0%, #d8dcff 45%, #bfc6ff 100%);
    color: #2e2e7a;
    box-shadow: 0 0 0 1px rgba(191, 198, 255, 0.7), 0 4px 12px rgba(120, 130, 220, 0.3);
    position: relative;
    overflow: hidden;
}

.lamp-FullCombo::after,
.lamp-Perfect::after,
.lamp-Max::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 35%,
            transparent 65%);
    opacity: 0.7;
    pointer-events: none;
}
</style>
