<script setup lang="ts">
import { ref } from "vue"

// --- props ---
const props = defineProps({
  user_id: { type: Number, required: true }
})

// --- emits ---
const emits = defineEmits(["refresh"])

// --- data ---
const input = ref(props.user_id)

// --- methods ---
const refresh = () => emits("refresh", input.value)
</script>

<template>
  <div class="align-items-center">
    <div class="input-group">
      <div class="input-group-prepend">
        <label
          for="input_user_id"
          class="btn btn-info text-nowrap"
          v-tooltip="'IDを入力後、更新をタップすると反映されます'"
        >
          ユーザーID
          <font-awesome-icon :icon="['fas', 'question-circle']" />
        </label>
      </div>
      <input
        id="input_user_id"
        class="form-control"
        type="number"
        v-model="input"
      />
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="refresh">
          更新
          <font-awesome-icon :icon="['fas', 'sync']" />
        </label>
      </div>
    </div>
  </div>
</template>
