import { watch, onUnmounted, unref } from 'vue'
import { useRoute } from 'vue-router'

export interface SeoOptions {
  title: string
  description: string
  image?: string
  type?: string
  jsonLd?: object
}

const SITE_URL = 'https://liuxiaoman.dev'
const DEFAULT_IMAGE = `${SITE_URL}/images/projects/blog.jpg`

function getOrCreateMeta(name: string, isProperty = false): HTMLMetaElement {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  return el
}

function updateMeta(name: string, content: string, isProperty = false) {
  getOrCreateMeta(name, isProperty).setAttribute('content', content)
}

let jsonLdEl: HTMLScriptElement | null = null

function setJsonLd(data: object) {
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script')
    jsonLdEl.type = 'application/ld+json'
    document.head.appendChild(jsonLdEl)
  }
  jsonLdEl.textContent = JSON.stringify(data)
}

function removeJsonLd() {
  if (jsonLdEl) {
    jsonLdEl.remove()
    jsonLdEl = null
  }
}

/**
 * 必须在 setup 顶层同步调用。
 * options 可为静态对象，或返回 SeoOptions 的 getter（用于异步数据，如文章详情）。
 */
export function useSeo(options: SeoOptions | (() => SeoOptions)) {
  const route = useRoute()
  const resolve = (): SeoOptions => (typeof options === 'function' ? options() : unref(options) as SeoOptions)

  function applySeo() {
    const o = resolve()
    document.title = o.title
    updateMeta('description', o.description)
    updateMeta('og:title', o.title, true)
    updateMeta('og:description', o.description, true)
    updateMeta('og:url', `${SITE_URL}${route.path}`, true)
    updateMeta('og:type', o.type || 'website', true)
    updateMeta('og:image', o.image || DEFAULT_IMAGE, true)
    updateMeta('twitter:card', 'summary_large_image')
    if (o.jsonLd) setJsonLd(o.jsonLd)
  }

  applySeo()

  watch(() => route.path, applySeo)

  onUnmounted(removeJsonLd)

  return { refresh: applySeo }
}
