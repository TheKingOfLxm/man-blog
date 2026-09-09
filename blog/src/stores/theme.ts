import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  function init() {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('theme')
    } catch {
      /* Storage may be disabled. */
    }
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = true
    }
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  function applyTheme() {
    document.documentElement.setAttribute(
      'data-theme',
      isDark.value ? 'dark' : 'light',
    )
  }

  watch(isDark, () => {
    applyTheme()
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {
      /* Keep the in-memory preference. */
    }
  })

  return { isDark, init, toggle }
})
