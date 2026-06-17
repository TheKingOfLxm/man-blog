<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import postsData from '../data/posts.json'
import { useSeo, type SeoOptions } from '../composables/useSeo'
import Toc from '../components/Toc.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()
const posts = postsData as Post[]

const post = ref<Post | undefined>(undefined)
const renderedContent = ref('')
const articleRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(false)

interface TocItem { id: string; text: string; level: number }
const tocItems = ref<TocItem[]>([])
const activeHeading = ref('')
let spyObserver: IntersectionObserver | null = null

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch { /* fallback */ }
    }
    return '<pre class="hljs"><code>' + MarkdownIt.prototype.utils.escapeHtml(str) + '</code></pre>'
  }
})

const currentIndex = computed(() => posts.findIndex(p => p.id === route.params.id))
const prevPost = computed(() => currentIndex.value > 0 ? posts[currentIndex.value - 1] : null)
const nextPost = computed(() => currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : null)

function seoOptions(): SeoOptions {
  if (post.value) {
    return {
      title: `${post.value.title} - 小满的技术随笔`,
      description: post.value.summary,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.summary,
        datePublished: post.value.date,
        keywords: post.value.tags.join(', '),
        author: { '@type': 'Person', name: '刘小满' }
      }
    }
  }
  return { title: '文章 - 小满的技术随笔', description: '小满的技术随笔' }
}

const { refresh: refreshSeo } = useSeo(seoOptions)

function clearSpy() {
  spyObserver?.disconnect()
  spyObserver = null
}

function extractToc() {
  if (!articleRef.value) return
  const headings = articleRef.value.querySelectorAll('h2, h3')
  const items: TocItem[] = []
  headings.forEach((h, i) => {
    const id = `heading-${i}`
    h.id = id
    items.push({ id, text: (h as HTMLElement).textContent || '', level: parseInt(h.tagName[1]) })
  })
  tocItems.value = items
}

function setupScrollSpy() {
  clearSpy()
  spyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeHeading.value = entry.target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )
  tocItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) spyObserver!.observe(el)
  })
}

async function loadArticle() {
  const id = route.params.id as string
  post.value = posts.find(p => p.id === id)
  loading.value = true
  error.value = false
  clearSpy()

  if (!post.value) {
    loading.value = false
    refreshSeo()
    return
  }

  refreshSeo()
  try {
    const modules = import.meta.glob('../../public/posts/*.md', { eager: true, query: '?raw', import: 'default' })
    const raw = modules[`../../public/posts/${post.value.id}.md`]
    if (!raw) {
      error.value = true
    } else {
      renderedContent.value = md.render(raw as string)
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }

  if (!error.value && post.value) {
    await nextTick()
    extractToc()
    setupScrollSpy()
  }
}

onMounted(loadArticle)
watch(() => route.params.id, loadArticle)
onUnmounted(clearSpy)
</script>

<template>
  <div class="post-page container">
    <ReadingProgress v-if="post && !loading && !error" />
    <button class="back-btn" @click="router.push('/blog')">← 返回文章</button>

    <!-- 加载骨架 -->
    <div v-if="loading && post" class="post-layout">
      <div class="post-content">
        <div class="skeleton" style="width: 60px; height: 22px;"></div>
        <div class="skeleton" style="width: 70%; height: 36px; margin-top: 14px;"></div>
        <div class="skeleton-lines">
          <div class="skeleton" style="width: 100%; height: 16px;"></div>
          <div class="skeleton" style="width: 92%; height: 16px;"></div>
          <div class="skeleton" style="width: 96%; height: 16px;"></div>
          <div class="skeleton" style="width: 80%; height: 16px;"></div>
        </div>
      </div>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="state">
      <h2>文章加载失败</h2>
      <p>抱歉，文章内容暂时无法加载。</p>
      <button class="btn btn-primary" @click="loadArticle">重新加载</button>
    </div>

    <!-- 正文 -->
    <div v-else-if="post" class="post-layout">
      <article ref="articleRef" class="post-content">
        <header class="post-header">
          <span class="kicker">{{ post.category }}</span>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <span>{{ post.date }}</span>
            <span class="dot"></span>
            <span v-if="post.readingTime">{{ post.readingTime }} 分钟阅读</span>
            <span class="dot" v-if="post.wordCount"></span>
            <span v-if="post.wordCount">{{ post.wordCount }} 字</span>
          </div>
          <div class="post-tags">
            <router-link v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { tag } }" class="tag">#{{ tag }}</router-link>
          </div>
        </header>
        <div class="markdown-body" v-html="renderedContent"></div>
      </article>

      <Toc v-if="tocItems.length" :items="tocItems" :active-id="activeHeading" />
    </div>

    <!-- 不存在 -->
    <div v-else class="state">
      <h2>文章未找到</h2>
      <button class="btn btn-primary" @click="router.push('/blog')">返回文章</button>
    </div>

    <!-- 上下篇 -->
    <nav v-if="post && !loading && !error" class="post-nav">
      <router-link v-if="prevPost" :to="`/blog/${prevPost.id}`" class="nav-link">
        <span class="nav-label">← 上一篇</span>
        <span class="nav-title">{{ prevPost.title }}</span>
      </router-link>
      <span v-else></span>
      <router-link v-if="nextPost" :to="`/blog/${nextPost.id}`" class="nav-link right">
        <span class="nav-label">下一篇 →</span>
        <span class="nav-title">{{ nextPost.title }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.post-page {
  padding-top: calc(var(--nav-height) + 32px);
  padding-bottom: 80px;
}
.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 20px;
}
.back-btn:hover { color: var(--accent-hover); }
.post-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}
.post-content {
  flex: 1;
  min-width: 0;
  max-width: var(--reading-width);
}
.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--rule);
}
.post-header h1 {
  font-size: clamp(26px, 4vw, 34px);
  margin: 12px 0 16px;
  line-height: 1.2;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 13px;
}
.dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }
.post-tags { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
.post-tags .tag { text-decoration: none; }
.post-tags .tag:hover { color: var(--accent); border-color: var(--accent); }

.skeleton-lines { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }

.state { text-align: center; padding: 80px 0; }
.state h2 { margin-bottom: 12px; }
.state p { color: var(--text-muted); margin-bottom: 24px; }

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  max-width: var(--reading-width);
  margin: 40px auto 0;
  padding-top: 28px;
  border-top: 1px solid var(--rule);
}
.nav-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  max-width: 48%;
}
.nav-link.right { text-align: right; margin-left: auto; }
.nav-label { font-size: 12px; color: var(--accent); font-family: var(--font-sans); }
.nav-title { font-size: 14px; font-weight: 600; color: var(--ink); }

/* Markdown 正文（drop cap + 暖色） */
:deep(.markdown-body) {
  font-size: 16px;
  line-height: 1.85;
  color: var(--text-body);
}
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  color: var(--ink);
  margin: 1.6em 0 0.7em;
}
:deep(.markdown-body h2) { font-size: 1.45em; padding-bottom: 0.3em; border-bottom: 1px solid var(--border); }
:deep(.markdown-body h3) { font-size: 1.2em; }
:deep(.markdown-body p) { margin: 1.1em 0; }
:deep(.markdown-body > p:first-of-type::first-letter) {
  font-family: var(--font-display);
  font-size: 3.2em;
  line-height: 0.8;
  float: left;
  padding: 6px 10px 0 0;
  color: var(--accent);
  font-weight: 600;
}
:deep(.markdown-body pre) {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;
  margin: 1.2em 0;
  font-size: 14px;
}
:deep(.markdown-body code) { font-family: var(--font-mono); }
:deep(.markdown-body :not(pre) > code) {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
}
:deep(.markdown-body ul),
:deep(.markdown-body ol) { padding-left: 1.5em; margin: 1.1em 0; }
:deep(.markdown-body blockquote) {
  border-left: 3px solid var(--accent);
  padding: 4px 0 4px 18px;
  margin: 1.2em 0;
  color: var(--text-muted);
  font-style: italic;
  font-family: var(--font-serif-cn);
}
:deep(.markdown-body a) { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
:deep(.markdown-body img) { border-radius: var(--radius-md); margin: 1.2em 0; }
:deep(.markdown-body hr) { border: none; border-top: 1px solid var(--border); margin: 2em 0; }

@media (max-width: 1024px) {
  .post-layout { flex-direction: column; }
}
@media (max-width: 640px) {
  .post-content { max-width: 100%; }
  .post-nav { flex-direction: column; }
  .post-nav .nav-link.right { text-align: left; margin-left: 0; }
}
</style>
