import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
  }

  function observeAll() {
    if (!observer) return
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      observer!.observe(el)
    })
  }

  onMounted(() => {
    setupObserver()
    observeAll()
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { refresh: observeAll }
}
