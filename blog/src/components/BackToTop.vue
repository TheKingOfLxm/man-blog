<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

function handleScroll() {
  show.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <Transition name="fade">
    <button v-if="show" class="back-to-top" @click="scrollToTop" title="回到顶部">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  backdrop-filter: blur(var(--blur-amount));
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: all var(--transition-fast);
  z-index: 90;
}

.back-to-top:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 24px var(--shadow-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
