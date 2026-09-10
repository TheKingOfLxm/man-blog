<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { LiteraryKind } from '../types'
import {
  getLiteraryWork,
  literaryCollections,
  literaryPath,
  literaryWorks,
} from '../lib/literature'
import site from '../data/site.json'
import LiteraryText from '../components/LiteraryText.vue'
import AppIcon from '../components/AppIcon.vue'
import NotFoundView from './NotFoundView.vue'
import { useSeo } from '../composables/useSeo'
import { useScrollReveal } from '../composables/useScrollReveal'

const props = defineProps<{ kind: LiteraryKind; id: string }>()
const work = computed(() => getLiteraryWork(props.kind, props.id))
const collection = computed(() => literaryCollections[props.kind])
const siblings = computed(() =>
  literaryWorks.filter((item) => item.kind === props.kind),
)
const index = computed(() =>
  siblings.value.findIndex((item) => item.id === props.id),
)
const previous = computed(() => siblings.value[index.value - 1])
const next = computed(() => siblings.value[index.value + 1])
const otherCollection = computed(
  () => literaryCollections[props.kind === 'shi' ? 'ci' : 'shi'],
)
const root = ref<HTMLElement | null>(null)
const { refresh } = useScrollReveal(root)
const { refresh: refreshSeo } = useSeo(() => ({
  title: work.value
    ? `${work.value.title} · ${site.author}`
    : '作品未找到 · 小满',
  description: work.value
    ? `${site.author}原创${collection.value.title}作《${work.value.title}》。${work.value.stanzas[0]}`
    : '这篇作品暂未收录。',
  type: 'article',
}))
watch(
  [() => props.kind, () => props.id],
  () => {
    refresh()
    refreshSeo()
  },
  { flush: 'post' },
)
</script>

<template>
  <div ref="root">
    <div v-if="work" class="literary-reading container">
      <div class="reading-breadcrumb reveal">
        <router-link :to="collection.path"
          ><AppIcon name="arrow" :size="15" class="back-arrow" /> 返回{{
            collection.title
          }}集</router-link
        ><span
          >{{ String(index + 1).padStart(2, '0') }} /
          {{ String(siblings.length).padStart(2, '0') }}</span
        >
      </div>
      <article
        class="poetry-paper reveal"
        :class="{ 'poem-paper': kind === 'shi' }"
        aria-labelledby="literary-title"
      >
        <header class="reading-heading">
          <span class="kicker"
            >{{ collection.english }} / {{ work.tune || '诗' }}</span
          >
          <h1 id="literary-title">{{ work.title }}</h1>
          <p>{{ site.author }}<span>原创</span></p>
        </header>
        <LiteraryText :work="work" />
        <div class="reading-colophon">
          <span class="colophon-line"></span
          ><span>小满 · {{ collection.title }}</span
          ><span class="colophon-line"></span>
        </div>
        <span class="paper-note" aria-hidden="true"
          >{{ site.author }} · 原创诗词</span
        >
      </article>
      <nav class="reading-navigation reveal" aria-label="继续阅读">
        <router-link :to="previous ? literaryPath(previous) : collection.path"
          ><small>{{ previous ? '上一篇' : '返回目录' }}</small
          ><span>{{
            previous?.title || `${collection.title}集`
          }}</span></router-link
        >
        <router-link :to="next ? literaryPath(next) : otherCollection.path"
          ><small>{{ next ? '下一篇' : '另一个篇章' }}</small
          ><span
            >{{ next?.title || `读${otherCollection.title}` }}
            <AppIcon name="diagonal" :size="16" /></span
        ></router-link>
      </nav>
    </div>
    <NotFoundView v-else />
  </div>
</template>

<style scoped>
.literary-reading {
  max-width: 1060px;
  padding-top: calc(var(--nav-height) + 50px);
  padding-bottom: 80px;
}
.reading-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
  color: var(--text-muted);
  font: 10px var(--font-mono);
}
.reading-breadcrumb a {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 12px;
}
.back-arrow {
  rotate: 180deg;
}
.poetry-paper {
  position: relative;
  padding: 60px clamp(24px, 6vw, 80px) 44px;
  border: 1px solid var(--border);
  border-top: 2px solid color-mix(in srgb, var(--accent) 50%, var(--border));
  border-radius: 3px;
  background: linear-gradient(140deg, var(--bg-surface), var(--bg-page));
  box-shadow: 0 20px 80px #00000008;
}
.reading-heading {
  padding-bottom: 38px;
  margin-bottom: 34px;
  border-bottom: 1px solid var(--border-soft);
}
.reading-heading h1 {
  font-family: var(--font-literary);
  font-size: clamp(25px, 3.5vw, 40px);
  letter-spacing: 0.08em;
  font-weight: 500;
  line-height: 1.7;
  margin: 16px 0 17px;
}
.reading-heading p {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
}
.reading-heading p span {
  font-size: 9px;
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
}
.poem-paper .literary-text {
  width: fit-content;
  margin: 0 auto;
  padding: 10px 0 24px;
}
.paper-note {
  position: absolute;
  right: 20px;
  top: 65px;
  writing-mode: vertical-rl;
  letter-spacing: 0.35em;
  font: 10px var(--font-literary);
  color: var(--text-faint);
}
.reading-colophon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;
  color: var(--text-muted);
  font-family: var(--font-literary);
  font-size: 11px;
  letter-spacing: 0.2em;
}
.colophon-line {
  width: 35px;
  height: 1px;
  background: var(--border);
}
.reading-navigation {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 32px;
}
.reading-navigation a {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 0;
  color: var(--text-body);
  border-bottom: 1px solid var(--border);
}
.reading-navigation a:last-child {
  align-items: flex-end;
  text-align: right;
}
.reading-navigation a:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.reading-navigation small {
  font-size: 10px;
  color: var(--text-muted);
}
.reading-navigation span {
  display: flex;
  align-items: center;
  gap: 12px;
  font: 17px/1.8 var(--font-literary);
}
@media (max-width: 600px) {
  .literary-reading {
    padding-top: calc(var(--nav-height) + 26px);
  }
  .poetry-paper {
    padding: 32px 22px;
  }
  .paper-note {
    display: none;
  }
  .reading-heading {
    padding-bottom: 26px;
    margin-bottom: 26px;
  }
  .reading-navigation {
    gap: 20px;
  }
  .reading-navigation span {
    font-size: 15px;
  }
}
</style>
