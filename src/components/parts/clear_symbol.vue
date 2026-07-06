<script setup lang="ts">
import SongDetail from "@/models/song_detail"

const props = defineProps<{
    row: SongDetail
}>()

</script>
<template>
    <span class="symbol-pill" :class="`symbol-${props.row.get('clear_type')}`">
        {{ props.row.get("clear_type") }}
    </span>
</template>
<style scoped>
.symbol-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.symbol-ExHard {
    background: linear-gradient(135deg, #ffe3a1 0%, #fff3c9 45%, #ffd27a 100%);
    color: #8a4b00;
    box-shadow: 0 0 0 1px rgba(255, 215, 120, 0.7), 0 4px 10px rgba(255, 180, 60, 0.28);
    position: relative;
    overflow: hidden;
}

.symbol-ExHard::after {
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

.symbol-FullCombo {
    background: linear-gradient(135deg, #9ff0f0 0%, #c9fbff 45%, #78dbe6 100%);
    color: #00545c;
    box-shadow: 0 0 0 1px rgba(120, 219, 230, 0.6), 0 4px 10px rgba(80, 180, 190, 0.25);
    position: relative;
    overflow: hidden;
}

.symbol-Perfect {
    background: linear-gradient(135deg, #d0d0ff 0%, #ece9ff 45%, #b0b0ff 100%);
    color: #2e2e6d;
    box-shadow: 0 0 0 1px rgba(176, 176, 255, 0.6), 0 4px 10px rgba(130, 130, 220, 0.25);
    position: relative;
    overflow: hidden;
}

.symbol-Max {
    background: linear-gradient(135deg, #f0f0ff 0%, #d8dcff 45%, #bfc6ff 100%);
    color: #2e2e7a;
    box-shadow: 0 0 0 1px rgba(191, 198, 255, 0.7), 0 4px 12px rgba(120, 130, 220, 0.3);
    position: relative;
    overflow: hidden;
}

.symbol-FullCombo::after,
.symbol-Perfect::after,
.symbol-Max::after {
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


.symbol-Failed {
    background: #f4d2d2;
    color: #9c2f2f;
}

.symbol-NoPlay {
    background: #e5e5e5;
    color: #5a5a5a;
}

.symbol-AssistEasy {
    background: #c6c6ff;
    color: #2d2d6a;
}

.symbol-LightAssistEasy {
    background: #ffc6ff;
    color: #6a2d6a;
}

.symbol-Easy {
    background: #d7f7d6;
    color: #1e6a2a;
}

.symbol-Normal {
    background: #ffe8b7;
    color: #9a5b00;
}

.symbol-Hard {
    background: #ffd6d6;
    color: #b22828;
}
</style>