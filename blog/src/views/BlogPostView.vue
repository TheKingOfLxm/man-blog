<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import postsData from '../data/posts.json'
import { useSeo } from '../composables/useSeo'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()

const posts = postsData as Post[]
const post = ref<Post | undefined>(undefined)
const renderedContent = ref('')
const articleRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(false)

interface TocItem {
  id: string
  text: string
  level: number
}
const tocItems = ref<TocItem[]>([])
const activeHeading = ref('')

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

async function loadArticle() {
  const id = route.params.id as string
  post.value = posts.find(p => p.id === id)
  loading.value = true
  error.value = false

  if (!post.value) {
    loading.value = false
    return
  }

  // 设置文章 SEO
  useSeo({
    title: `${post.value.title} - 小满的博客`,
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
  })

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

  if (!error.value) {
    await nextTick()
    extractToc()
    setupScrollSpy()
  }
}

onMounted(loadArticle)

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
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )
  tocItems.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
}
</script>

<template>
  <div class="blog-post-page">
    <div class="container">
      <button class="back-btn" @click="router.push('/blog')" aria-label="返回文章列表">
        ← 返回文章列表
      </button>

      <!-- 加载状态 -->
      <div v-if="loading && post" class="post-layout">
        <div class="post-content glass">
          <header class="post-header">
            <div class="skeleton" style="width: 60px; height: 24px;"></div>
            <div class="skeleton" style="width: 65%; height: 36px; margin-top: 16px;"></div>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
              <div class="skeleton" style="width: 100px; height: 18px;"></div>
              <div class="skeleton" style="width: 60px; height: 18px;"></div>
              <div class="skeleton" style="width: 70px; height: 18px;"></div>
            </div>
          </header>
          <div class="skeleton-lines">
            <div class="skeleton" style="width: 100%; height: 16px;"></div>
            <div class="skeleton" style="width: 90%; height: 16px;"></div>
            <div class="skeleton" style="width: 95%; height: 16px;"></div>
            <div class="skeleton" style="width: 80%; height: 16px;"></div>
            <div class="skeleton" style="width: 88%; height: 16px;"></div>
            <div class="skeleton" style="width: 100%; height: 120px;"></div>
            <div class="skeleton" style="width: 92%; height: 16px;"></div>
            <div class="skeleton" style="width: 85%; height: 16px;"></div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">:(</div>
        <h2>文章加载失败</h2>
        <p>抱歉，文章内容暂时无法加载，请稍后再试。</p>
        <button class="btn btn-primary" @click="loadArticle">重新加载</button>
      </div>

      <!-- 正常内容 -->
      <div v-else-if="post" class="post-layout">
        <article class="post-content glass" ref="articleRef" role="article">
          <header class="post-header">
            <span class="tag">{{ post.category }}</span>
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <span>{{ post.date }}</span>
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="mini-tag">{{ tag }}</span>
              </div>
            </div>
          </header>
          <div class="markdown-body" v-html="renderedContent"></div>
        </article>

        <aside v-if="tocItems.length" class="toc-sidebar glass">
          <h4 class="toc-title">目录</h4>
          <nav class="toc-list" aria-label="文章目录">
            <a
              v-for="item in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="toc-link"
              :class="{ active: activeHeading === item.id, 'toc-h3': item.level === 3 }"
              :aria-current="activeHeading === item.id ? 'true' : undefined"
            >{{ item.text }}</a>
          </nav>
        </aside>
      </div>

      <!-- 文章不存在 -->
      <div v-else class="not-found">
        <h2>文章未找到</h2>
        <button class="btn btn-primary" @click="router.push('/blog')">返回博客</button>
      </div>

      <!-- 上下篇导航 -->
      <div v-if="post && !loading && !error" class="post-nav">
        <router-link
          v-if="prevPost"
          :to="`/blog/${prevPost.id}`"
          class="nav-link glass"
        >
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ prevPost.title }}</span>
        </router-link>
        <div v-else></div>

        <router-link
          v-if="nextPost"
          :to="`/blog/${nextPost.id}`"
          class="nav-link glass"
        >
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ nextPost.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-post-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}

.post-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.post-layout .post-content {
  flex: 1;
  min-width: 0;
}

/* TOC 侧栏 */
.toc-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 20px;
  position: sticky;
  top: calc(var(--nav-height) + 24px);
}

.toc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-link {
  display: block;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all var(--transition-fast);
  line-height: 1.5;
}

.toc-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.toc-link.active {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

.toc-link.toc-h3 {
  padding-left: 20px;
}

/* 骨架屏 */
.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 80px 0;
}

.error-icon {
  font-size: 48px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.error-state h2 {
  margin-bottom: 12px;
}

.error-state p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .post-layout {
    flex-direction: column;
  }

  .toc-sidebar {
    display: none;
  }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-primary-hover);
}

.post-content {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.post-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 16px 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.post-tags {
  display: flex;
  gap: 6px;
}

.mini-tag {
  font-size: 12px;
  padding: 2px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
}

.not-found {
  text-align: center;
  padding: 80px 0;
}

.not-found h2 {
  margin-bottom: 24px;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  max-width: 800px;
  margin: 32px auto 0;
}

.nav-link {
  flex: 1;
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link:hover {
  transform: translateY(-2px);
}

.nav-label {
  font-size: 13px;
  color: var(--color-primary);
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
}

@media (max-width: 768px) {
  .post-content {
    padding: 24px;
  }

  .post-nav {
    flex-direction: column;
  }

  .post-header h1 {
    font-size: 24px;
  }
}
</style>
