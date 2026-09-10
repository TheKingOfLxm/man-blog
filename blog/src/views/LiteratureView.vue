<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  literaryCollections,
  literaryWorks,
  literaryPath,
  searchLiterature,
} from '../lib/literature'
import type { LiteraryKind } from '../types'
import site from '../data/site.json'
import AppIcon from '../components/AppIcon.vue'
import LiteraryText from '../components/LiteraryText.vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'

const props = defineProps<{ kind: LiteraryKind }>()
const collection = computed(() => literaryCollections[props.kind])
const works = computed(() =>
  literaryWorks.filter((work) => work.kind === props.kind),
)
const tunes = computed(() => [
  ...new Set(works.value.flatMap((work) => (work.tune ? [work.tune] : []))),
])
const query = ref('')
const tune = ref('')
function resetFilters() {
  query.value = ''
  tune.value = ''
}
const filtered = computed(() =>
  searchLiterature(query.value, props.kind, tune.value),
)
const root = ref<HTMLElement | null>(null)
const { refresh } = useScrollReveal(root)
const { refresh: refreshSeo } = useSeo(() => ({
  title: `${collection.value.title} · ${site.author}的原创诗词`,
  description: `${site.author}的原创${collection.value.title}集，收录${works.value.length}${collection.value.unit}。${collection.value.subtitle}`,
}))
watch(
  () => props.kind,
  () => {
    query.value = ''
    tune.value = ''
    refreshSeo()
  },
  { flush: 'post' },
)
watch(filtered, refresh, { flush: 'post' })
</script>

<template>
  <div ref="root" class="literature container">
    <header class="page-head literature-head reveal">
      <span class="kicker">{{ collection.english }} / Original writings</span>
      <h1>{{ collection.title }}<span class="collection-seal">小满</span></h1>
      <p class="collection-subtitle">{{ collection.subtitle }}</p>
      <div class="collection-byline">
        <span>{{ site.author }} · 原创</span
        ><span>{{ works.length }} {{ collection.unit }}作品</span>
      </div>
      <span class="watermark" aria-hidden="true">{{ collection.title }}</span>
    </header>

    <div class="collection-tools reveal">
      <nav class="collection-tabs" aria-label="诗词板块">
        <router-link
          to="/poems"
          :aria-current="kind === 'shi' ? 'page' : undefined"
          >诗 <small>POEMS</small></router-link
        >
        <router-link to="/ci" :aria-current="kind === 'ci' ? 'page' : undefined"
          >词 <small>CI</small></router-link
        >
      </nav>
      <div v-if="works.length > 1" class="collection-filters">
        <label class="verse-search"
          ><AppIcon name="search" :size="16" /><input
            v-model="query"
            type="search"
            placeholder="寻一个词牌，或一句诗"
            aria-label="搜索题目或诗句"
        /></label>
        <select v-if="tunes.length" v-model="tune" aria-label="按词牌筛选">
          <option value="">全部词牌</option>
          <option v-for="name in tunes" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
      </div>
    </div>

    <div
      v-if="filtered.length"
      class="verse-grid"
      :class="{ 'poem-grid': kind === 'shi' }"
    >
      <router-link
        v-for="(work, index) in filtered"
        :key="work.id"
        :to="literaryPath(work)"
        class="verse-card reveal"
        data-pointer-surface
        data-cursor-label="细读"
      >
        <span class="pointer-shine" aria-hidden="true"></span>
        <div class="verse-heading">
          <span class="verse-number"
            >{{ String(index + 1).padStart(2, '0') }} /
            {{ work.tune || '诗' }}</span
          ><AppIcon name="diagonal" :size="17" />
        </div>
        <h2>{{ work.title }}</h2>
        <LiteraryText v-if="kind === 'shi'" :work="work" />
        <p v-else class="verse-excerpt">{{ work.stanzas[0] }}</p>
        <div class="verse-footer">
          <span>{{ site.author }}</span
          ><span
            >展开{{ collection.title }}卷 <AppIcon name="arrow" :size="15"
          /></span>
        </div>
      </router-link>
    </div>
    <div v-else class="empty-verses" role="status">
      <p>暂未寻到这句文字。</p>
      <button class="btn btn-outline" @click="resetFilters">
        查看全部{{ collection.title }}
      </button>
    </div>
    <p class="collection-end">字句之间，留住一时心绪。<span>✳</span></p>
  </div>
</template>

<style scoped>
.literature {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 72px;
}
.literature-head {
  position: relative;
  overflow: hidden;
}
.literature-head h1 {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: var(--font-literary);
}
.collection-seal {
  display: grid;
  place-items: center;
  width: 28px;
  height: 43px;
  border: 1px solid color-mix(in srgb, #ad7960 65%, var(--border));
  color: #ac816c;
  border-radius: 3px 1px 4px 1px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  writing-mode: vertical-rl;
  letter-spacing: 0.2em;
  rotate: -5deg;
}
.collection-subtitle {
  font-family: var(--font-literary);
  font-size: 18px;
  letter-spacing: 0.12em;
  color: var(--text-body);
}
.collection-byline {
  display: flex;
  gap: 26px;
  margin-top: 24px;
  font-size: 11px;
  color: var(--text-muted);
}
.watermark {
  position: absolute;
  right: 4%;
  top: -25px;
  font: 250px/1.3 var(--font-literary);
  color: var(--ink);
  opacity: 0.035;
  pointer-events: none;
}
.collection-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin: 28px 0;
}
.collection-tabs {
  display: flex;
  gap: 8px;
}
.collection-tabs a {
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 30px;
  color: var(--text-muted);
  font-family: var(--font-literary);
  font-size: 18px;
}
.collection-tabs small {
  font: 8px var(--font-mono);
  letter-spacing: 0.08em;
}
.collection-tabs [aria-current='page'] {
  color: var(--on-accent);
  border-color: var(--accent);
  background: var(--accent);
}
.collection-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.verse-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  padding: 9px 0;
}
.verse-search input {
  width: 190px;
  background: transparent;
  border: 0;
  color: var(--ink);
  font-size: 12px;
}
.verse-search input::placeholder {
  color: var(--text-muted);
}
.collection-filters select {
  background: var(--bg-surface);
  color: var(--text-body);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
}
.verse-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.verse-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 32px 36px 24px;
  border: 1px solid var(--border);
  border-radius: 4px 16px 4px 4px;
  background: linear-gradient(135deg, var(--bg-surface), var(--bg-page));
  color: var(--text-body);
  transition: border-color 0.3s;
}
.verse-card:hover {
  border-color: var(--accent);
}
.verse-heading,
.verse-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  color: var(--text-muted);
}
.verse-number {
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
}
.verse-card h2 {
  font-family: var(--font-literary);
  font-size: clamp(21px, 2vw, 27px);
  letter-spacing: 0.04em;
  font-weight: 500;
  line-height: 1.6;
  margin: 22px 0 20px;
}
.verse-excerpt {
  font-family: var(--font-literary);
  font-size: 15px;
  line-height: 2.15;
  letter-spacing: 0.05em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 28px;
}
.verse-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-soft);
  padding-top: 16px;
}
.verse-footer > span:last-child {
  display: flex;
  align-items: center;
  gap: 8px;
}
.poem-grid {
  grid-template-columns: 1fr;
}
.poem-grid .verse-card {
  padding: 38px clamp(26px, 7vw, 100px);
}
.poem-grid .verse-card h2 {
  font-size: 32px;
}
.poem-grid .literary-text {
  align-self: center;
  padding: 15px 0 52px;
}
.collection-end {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 60px;
  font-family: var(--font-literary);
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}
.collection-end span {
  color: var(--accent);
}
.empty-verses {
  text-align: center;
  padding: 70px 20px;
  color: var(--text-muted);
}
.empty-verses p {
  margin-bottom: 22px;
}
@media (max-width: 720px) {
  .verse-grid {
    grid-template-columns: 1fr;
  }
  .verse-card {
    padding: 26px 24px 22px;
  }
  .collection-filters {
    width: 100%;
  }
  .verse-search {
    flex: 1;
    min-width: 0;
  }
  .verse-search input {
    width: 100%;
    min-width: 0;
  }
  .watermark {
    right: -15px;
    font-size: 210px;
  }
  .collection-subtitle {
    font-size: 16px;
    letter-spacing: 0.05em;
  }
}
@media (prefers-reduced-motion: reduce) {
  .verse-card {
    transition: none;
  }
}
</style>
