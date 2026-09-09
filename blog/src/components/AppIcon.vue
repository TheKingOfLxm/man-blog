<script setup lang="ts">
withDefaults(defineProps<{ name?: string; size?: number }>(), {
  name: 'arrow',
  size: 18,
})
const paths: Record<string, string> = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  diagonal: 'M6 18 18 6M6 6h12v12',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
  down: 'M12 4v16m-6-6 6 6 6-6',
  github:
    'M9 19c-5 1-5-3-7-3m14 6v-4c0-1-.1-2-.6-2.5 3.5-.4 7.1-1.7 7.1-7.5A5.9 5.9 0 0 0 21 4c.1-1-.1-2-.5-3 0 0-1.3-.4-4.5 1.7a15.4 15.4 0 0 0-8 0C4.8.6 3.5 1 3.5 1 3.1 2 2.9 3 3 4a5.9 5.9 0 0 0-1.5 4c0 5.8 3.6 7.1 7.1 7.5C8.1 16 8 17 8 18v4',
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
}
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.arrow" />
  </svg>
</template>
