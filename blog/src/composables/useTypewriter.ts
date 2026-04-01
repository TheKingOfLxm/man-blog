import { ref, onMounted, onUnmounted } from 'vue'

export function useTypewriter(texts: string[], speed = 80, deleteSpeed = 40, pause = 2000) {
  const display = ref('')
  const textIndex = ref(0)
  const charIndex = ref(0)
  const isDeleting = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function tick() {
    const current = texts[textIndex.value]

    if (!isDeleting.value) {
      display.value = current.slice(0, charIndex.value + 1)
      charIndex.value++

      if (charIndex.value >= current.length) {
        isDeleting.value = true
        timer = setTimeout(tick, pause)
        return
      }
      timer = setTimeout(tick, speed)
    } else {
      display.value = current.slice(0, charIndex.value - 1)
      charIndex.value--

      if (charIndex.value <= 0) {
        isDeleting.value = false
        textIndex.value = (textIndex.value + 1) % texts.length
        timer = setTimeout(tick, speed)
        return
      }
      timer = setTimeout(tick, deleteSpeed)
    }
  }

  onMounted(() => tick())
  onUnmounted(() => { if (timer) clearTimeout(timer) })

  return { display }
}
