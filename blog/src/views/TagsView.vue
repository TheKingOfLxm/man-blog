<script setup lang="ts">
import { computed, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import type { Post } from '../types'

const posts = postsData as Post[]

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts) map.set(p.category, (map.get(p.category) || 0) + 1)
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
})

const tags = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts) for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1)
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
})

// 按数量映射字号
function size(count: number, max: number) {
  const min = 13, top = 26
  return Math.round(min + (top - min) * (count / max))
}

const rootRef = ref<HTMLElement | null>(null)
useScrollReveal(rootRef)
useSeo({
  title: '标签索引 - 小满的技术随笔',
  description: '按分类与标签浏览全部文章。'
})
</script>

<template>
  <div class="tags container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">Index</span>
      <h1>标签索引</h1>
      <p class="subtitle">按分类与标签浏览全部文章</p>
    </header>

    <section class="block reveal">
      <h2 class="block-title">分类</h2>
      <div class="cloud">
        <router-link
          v-for="[cat, n] in categories"
          :key="cat"
          :to="{ path: '/blog', query: { cat } }"
          class="cat-chip"
        >{{ cat }} <span class="n">{{ n }}</span></router-link>
      </div>
    </section>

    <section class="block reveal">
      <h2 class="block-title">标签</h2>
      <div class="cloud">
        <router-link
          v-for="[tag, n] in tags"
          :key="tag"
          :to="{ path: '/blog', query: { tag } }"
          class="tag-chip"
          :style="{ fontSize: size(n, tags[0][1]) + 'px' }"
        >{{ tag }} <span class="n">{{ n }}</span></router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tags {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head { text-align: center; margin-bottom: 44px; }
.page-head h1 { font-size: clamp(28px, 5vw, 40px); margin: 10px 0 6px; }
.subtitle { color: var(--text-muted); font-size: 15px; }
.block { margin-bottom: 48px; }
.block-title {
  font-size: 16px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.cloud { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: baseline; }
.cat-chip {
  padding: 6px 14px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-body);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.cat-chip:hover { color: var(--accent); border-color: var(--accent); }
.tag-chip {
  font-family: var(--font-sans);
  line-height: 1;
  color: var(--text-body);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.tag-chip:hover { color: var(--accent); }
.n { color: var(--text-faint); font-size: 0.7em; margin-left: 3px; }
</style>
