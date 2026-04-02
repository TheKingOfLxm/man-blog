import { watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface SeoOptions {
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
  const el = getOrCreateMeta(name, isProperty)
  el.setAttribute('content', content)
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

export function useSeo(options: SeoOptions) {
  const route = useRoute()

  function applySeo() {
    document.title = options.title
    updateMeta('description', options.description)
    updateMeta('og:title', options.title, true)
    updateMeta('og:description', options.description, true)
    updateMeta('og:url', `${SITE_URL}${route.path}`, true)
    updateMeta('og:type', options.type || 'website', true)
    updateMeta('og:image', options.image || DEFAULT_IMAGE, true)
    updateMeta('twitter:card', 'summary_large_image')

    if (options.jsonLd) {
      setJsonLd(options.jsonLd)
    }
  }

  applySeo()

  watch(() => route.path, applySeo)

  onUnmounted(() => {
    removeJsonLd()
  })
}
