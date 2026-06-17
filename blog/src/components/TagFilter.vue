<script setup lang="ts">
defineProps<{
  tags: string[]
  modelValue: string
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="tag-filter" role="group" aria-label="按标签筛选">
    <button
      class="chip"
      :class="{ active: !modelValue }"
      @click="$emit('update:modelValue', '')"
    >全部标签</button>
    <button
      v-for="t in tags"
      :key="t"
      class="chip"
      :class="{ active: modelValue === t }"
      @click="$emit('update:modelValue', modelValue === t ? '' : t)"
    >{{ t }}</button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  padding: 5px 12px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.chip:hover { color: var(--accent); border-color: var(--accent); }
.chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fffdf8;
}
</style>
