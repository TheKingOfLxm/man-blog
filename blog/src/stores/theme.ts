import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function init() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  watch(isDark, () => {
    applyTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  return { isDark, init, toggle }
})
