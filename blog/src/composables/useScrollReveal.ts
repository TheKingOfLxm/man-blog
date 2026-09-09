import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Scoped, reversible reveals; refresh also handles filter-created DOM. */
export function useScrollReveal(root?: Ref<HTMLElement | null>) {
  let media: gsap.MatchMedia | undefined
  let context: gsap.Context | undefined
  function refresh() {
    context?.revert()
    media?.revert()
    const scope = root?.value ?? document
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      context = gsap.context(() => {
        scope.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 96%', once: true },
            clearProps: 'transform,opacity',
          })
        })
      }, root?.value ?? undefined)
      return () => context?.revert()
    })
    ScrollTrigger.refresh()
  }
  onMounted(refresh)
  onUnmounted(() => {
    context?.revert()
    media?.revert()
  })
  return { refresh }
}
