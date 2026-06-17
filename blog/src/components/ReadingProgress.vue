<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const progress = ref(0)
function onScroll() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  progress.value = total > 0 ? (h.scrollTop / total) * 100 : 0
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="reading-progress" :style="{ transform: `scaleX(${progress / 100})` }" aria-hidden="true"></div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  transform-origin: left;
  background: var(--accent);
  z-index: 110;
}
</style>
