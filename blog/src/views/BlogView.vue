<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'
import postsData from '../data/posts.json'
import PostCard from '../components/PostCard.vue'
import TagFilter from '../components/TagFilter.vue'
import type { Post } from '../types'

const route = useRoute()
const router = useRouter()
const posts = postsData as Post[]

const categories = ['全部', ...Array.from(new Set(posts.map(p => p.category)))]
const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort()

const selectedCategory = ref<string>((route.query.cat as string) || '全部')
const selectedTag = ref<string>((route.query.tag as string) || '')

const filtered = computed(() => {
  return posts.filter((p) => {
    const catOk = selectedCategory.value === '全部' || p.category === selectedCategory.value
    const tagOk = !selectedTag.value || p.tags.includes(selectedTag.value)
    return catOk && tagOk
  })
})

// 状态 -> URL
watch([selectedCategory, selectedTag], ([cat, tag]) => {
  const query: Record<string, string> = {}
  if (cat && cat !== '全部') query.cat = cat
  if (tag) query.tag = tag
  // catch 吞掉「导航到与当前相同的 URL」的 duplicated 失败（如浏览器后退后的回写）
  router.replace({ query }).catch(() => {})
})

// URL -> 状态：浏览器前进/后退等改变 URL 时，让筛选状态跟随 query
watch(
  () => [route.query.cat, route.query.tag] as [unknown, unknown],
  ([cat, tag]) => {
    const c = (cat as string) || '全部'
    const t = (tag as string) || ''
    // 仅在值真正变化时赋值，避免与上面的 watch 互相触发形成循环
    if (selectedCategory.value !== c) selectedCategory.value = c
    if (selectedTag.value !== t) selectedTag.value = t
  }
)

// 互斥单维度：切换分类或标签时清空另一维度，避免交集筛选意外缩小甚至为空
function selectCategory(cat: string) {
  selectedCategory.value = cat
  selectedTag.value = ''
}
function selectTag(tag: string) {
  selectedTag.value = tag
  selectedCategory.value = '全部'
}

const rootRef = ref<HTMLElement | null>(null)
const { refresh } = useScrollReveal(rootRef)
// flush:'post'：等 DOM 更新后再观察新渲染的卡片。若用默认的 pre，refresh 会跑在旧 DOM 上、
// 抓不到新挂载的 .reveal，它们就停在 opacity:0——这正是「筛选后列表看起来变空」的真因（数据对，只是看不见）
watch(filtered, () => { refresh() }, { flush: 'post' })

useSeo({
  title: '文章 - 小满的技术随笔',
  description: '记录 Vue、CSS、工程化等前端实践里的思考与避坑。',
  type: 'website'
})
</script>

<template>
  <div class="blog container" ref="rootRef">
    <header class="page-head reveal">
      <span class="kicker">Archive</span>
      <h1>文章</h1>
      <p class="subtitle">记录前端实践里的思考、踩坑与避坑</p>
    </header>

    <div class="filters reveal">
      <div class="cat-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectCategory(cat)"
        >{{ cat }}</button>
      </div>
      <TagFilter :model-value="selectedTag" :tags="allTags" @update:model-value="selectTag" />
    </div>

    <div class="posts-grid" v-if="filtered.length">
      <PostCard v-for="post in filtered" :key="post.id" :post="post" />
    </div>
    <div v-else class="empty reveal" role="status">
      <p>没有找到匹配的文章</p>
      <button class="btn btn-outline btn-sm" @click="selectCategory('全部')">清除筛选</button>
    </div>
  </div>
</template>

<style scoped>
.blog {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
}
.page-head {
  text-align: center;
  margin-bottom: 36px;
}
.page-head h1 {
  font-size: clamp(28px, 5vw, 40px);
  margin: 10px 0 6px;
}
.subtitle { color: var(--text-muted); font-size: 15px; }
.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--rule);
}
.cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn {
  padding: 7px 16px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--text-body);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.cat-btn:hover { color: var(--accent); border-color: var(--accent); }
.cat-btn.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--bg-page);
}
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 28px;
  padding-top: 20px;
}
.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
@media (max-width: 640px) {
  .posts-grid { grid-template-columns: 1fr; }
}
</style>
