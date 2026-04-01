<script setup lang="ts">
import { useThemeStore } from '../stores/theme'

const theme = useThemeStore()

function toggleWithAnimation(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // 如果浏览器不支持 View Transition，直接切换
  if (!document.startViewTransition) {
    theme.toggle()
    return
  }

  const transition = document.startViewTransition(() => {
    theme.toggle()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ]

    document.documentElement.animate(
      { clipPath: theme.isDark ? clipPath.reverse() : clipPath },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: theme.isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)'
      }
    )
  })
}
</script>

<template>
  <button class="theme-toggle" @click="toggleWithAnimation" :title="theme.isDark ? '切换亮色' : '切换暗色'">
    <svg v-if="!theme.isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </button>
</template>

<style>
/* View Transition 圆形过渡 - 需要 ::view-transition 所以不能 scoped */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

[data-theme='dark']::view-transition-old(root) {
  z-index: 9999;
}

[data-theme='dark']::view-transition-new(root) {
  z-index: 1;
}
</style>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(8px);
}

.theme-toggle:hover {
  background: var(--color-primary);
  color: white;
  transform: rotate(15deg);
}
</style>
