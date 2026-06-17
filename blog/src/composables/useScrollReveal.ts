import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 在组件根元素内观察 .reveal 元素，进入视口加 .visible。
 * 传入 root 可把查询限定到组件根（避免跨组件误捕）；不传则回退到 document。
 * 通过 refresh() 重新观察新增的 .reveal（如筛选后重渲染）。
 */
export function useScrollReveal(root?: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  }

  function observeAll() {
    if (!observer) return
    const scope = root?.value ?? document
    scope.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      observer!.observe(el)
    })
  }

  onMounted(() => {
    setupObserver()
    observeAll()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { refresh: observeAll }
}
