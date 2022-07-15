<script setup lang="ts">
import { useFilterStore } from '@/store/filter'
import { computed } from 'vue'

const store = useFilterStore()

// --- computed ---
const length = computed({
  get() { return store.filter.max_length },
  set(value: number) { store.setLength(value) }
})

</script>

<template>
  <div class="align-items-center">
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="max_length" class="btn btn-info text-nowrap" v-tooltip="
          '詳細表上に表示する曲数を制限します フィルタリングは全曲から行われます'
        ">
          表示曲数
          <font-awesome-icon :icon="['fas', 'question-circle']" />
        </label>
      </div>
      <input id="max_length" type="number" v-model="length" class="form-control" />
      <div class="input-group-append">
        <label for="max_length" class="btn btn-info text-nowrap">曲</label>
      </div>
    </div>
  </div>
</template>
