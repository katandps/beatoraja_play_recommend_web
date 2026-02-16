<script setup lang="ts">
defineProps<{
    selectedTableName: string
    userName: string
    userId: number
    lastUpdated: string
    tableOptions: { name: string; id: number }[]
    selectedTableId: number
    isLoading: boolean
}>()

const emit = defineEmits<{
    (e: "update:selectedTableId", value: number): void
    (e: "changeTable"): void
}>()

const onSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const value = parseInt(target.value, 10)
    emit("update:selectedTableId", Number.isFinite(value) ? value : 0)
    emit("changeTable")
}
</script>

<template>
    <header class="hero">
        <div>
            <div class="hero-badge">Difficulty Table</div>
            <h2>難易度表: {{ selectedTableName }}</h2>
            <p class="sub">
                ユーザー: {{ userName || userId }} | 更新日: {{ lastUpdated }}
            </p>
            <div class="hero-meta">
                <label class="meta-label" for="table-select">難易度表</label>
                <select id="table-select" class="form-control form-control-sm" :value="selectedTableId"
                    @change="onSelectChange">
                    <option v-for="option in tableOptions" :key="option.name" :value="option.id">
                        {{ option.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="hero-actions">
            <button class="btn btn-outline-dark btn-sm" :disabled="isLoading"
                v-tooltip="{ content: '未実装', delay: { show: 0, hide: 0 } }">
                <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
                画像エクスポート
            </button>
            <button class="btn btn-outline-dark btn-sm" :disabled="isLoading"
                v-tooltip="{ content: '未実装', delay: { show: 0, hide: 0 } }">
                <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
                CSV
            </button>
            <button class="btn btn-outline-dark btn-sm" :disabled="isLoading"
                v-tooltip="{ content: '未実装', delay: { show: 0, hide: 0 } }">
                <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
                共有リンク
            </button>
        </div>
    </header>
</template>

<style scoped>
.hero {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-radius: 12px;
    background: linear-gradient(120deg, #fff0d9, #f8ecff 65%, #d8f5ff);
    margin-bottom: 20px;
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
    animation: rise 600ms ease both;
}

.hero h2 {
    font-family: "DM Serif Display", "Georgia", serif;
    letter-spacing: 0.5px;
    margin: 6px 0 2px;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: #ffe7d6;
    color: #7a3a1e;
}

.hero-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.sub {
    margin: 0;
    color: var(--muted);
}

.hero-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .hero {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
