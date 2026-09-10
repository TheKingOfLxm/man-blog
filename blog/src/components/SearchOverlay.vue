<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import postsData from '../data/posts.json'
import { filterPosts } from '../composables/useSearch'
import {
  literaryCollections,
  literaryPath,
  searchLiterature,
} from '../lib/literature'
import type { Post } from '../types'
import { useScrollLock } from '@vueuse/core'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const scrollLocked = useScrollLock(document.body)
let previousFocus: HTMLElement | null = null
const posts = postsData as Post[]

const results = computed(() =>
  [
    ...filterPosts(posts, query.value).map((post) => ({
      ...post,
      path: `/blog/${post.id}`,
    })),
    ...searchLiterature(query.value).map((work) => ({
      id: work.id,
      title: work.title,
      category: literaryCollections[work.kind].title,
      path: literaryPath(work),
      readingTime: undefined,
    })),
  ].slice(0, 8),
)

watch(
  () => props.open,
  (v) => {
    scrollLocked.value = v
    if (v) {
      previousFocus = document.activeElement as HTMLElement | null
      query.value = ''
      nextTick(() => inputRef.value?.focus())
    } else {
      nextTick(() => previousFocus?.focus())
    }
  },
)

function close() {
  emit('update:open', false)
}
function go(path: string) {
  close()
  router.push(path)
}
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('update:open', !props.open)
  } else if (e.key === 'Escape' && props.open) {
    close()
  } else if (e.key === 'Tab' && props.open) {
    const elements =
      panelRef.value?.querySelectorAll<HTMLElement>('input, button')
    if (!elements?.length) return
    const first = elements[0]!
    const last = elements[elements.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  scrollLocked.value = false
})
</script>

<template>
  <Transition name="overlay">
    <div v-if="open" class="overlay" @click.self="close">
      <div
        ref="panelRef"
        class="panel"
        role="dialog"
        aria-modal="true"
        aria-label="搜索文章与诗词"
      >
        <div class="search-head">
          <span class="icon">⌕</span>
          <input
            ref="inputRef"
            v-model="query"
            class="search-input"
            type="text"
            placeholder="搜索文章、诗词标题或诗句…"
            aria-label="搜索"
          />
          <button class="close-search" aria-label="关闭搜索" @click="close">
            <kbd>ESC</kbd>
          </button>
        </div>
        <ul class="result-list">
          <li v-if="results.length === 0" class="empty">没有匹配的内容</li>
          <li v-for="r in results" :key="r.path">
            <button class="result" @click="go(r.path)">
              <span class="r-cat kicker">{{ r.category }}</span>
              <span class="r-title">{{ r.title }}</span>
              <span class="r-meta" v-if="r.readingTime"
                >{{ r.readingTime }} 分钟</span
              >
            </button>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #05080499;
  backdrop-filter: blur(14px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
}
.panel {
  width: min(620px, 92vw);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.search-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}
.icon {
  color: var(--text-muted);
  font-size: 18px;
}
.search-input {
  min-width: 0;
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--ink);
}
kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
}
.close-search {
  border: 0;
  background: transparent;
  padding: 6px;
}
.result-list {
  list-style: none;
  max-height: 50vh;
  overflow-y: auto;
}
.empty {
  padding: 28px 20px;
  color: var(--text-muted);
  font-size: 14px;
  text-align: center;
}
.result {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}
.result:hover {
  background: var(--bg-surface-alt);
}
.r-title {
  flex: 1;
  color: var(--ink);
  font-size: 14.5px;
  font-weight: 500;
}
.r-cat {
  flex-shrink: 0;
}
.r-meta {
  font-size: 11.5px;
  color: var(--text-faint);
}
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-active .panel,
.overlay-leave-active .panel {
  transition: transform 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
.overlay-enter-from .panel,
.overlay-leave-to .panel {
  transform: translateY(-12px);
}
</style>
