<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  items: { id: string; text: string; level: number }[]
  activeId: string
}>()
const mobileToc = ref<HTMLDetailsElement | null>(null)
function jump(e: Event, id: string) {
  e.preventDefault()
  if (mobileToc.value) mobileToc.value.open = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}
</script>

<template>
  <!-- 移动端折叠 -->
  <details ref="mobileToc" class="toc-mobile">
    <summary>目录</summary>
    <nav class="toc-list" aria-label="文章目录">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="toc-link"
        :class="{ active: activeId === item.id, h3: item.level === 3 }"
        @click="(e) => jump(e, item.id)"
        >{{ item.text }}</a
      >
    </nav>
  </details>

  <!-- 桌面侧栏 -->
  <aside class="toc-aside">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-list" aria-label="文章目录">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="toc-link"
        :class="{ active: activeId === item.id, h3: item.level === 3 }"
        @click="(e) => jump(e, item.id)"
        >{{ item.text }}</a
      >
    </nav>
  </aside>
</template>

<style scoped>
.toc-title {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toc-link {
  display: block;
  padding: 5px 10px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  border-radius: 0;
  transition: all var(--transition-fast);
  line-height: 1.5;
}
.toc-link:hover {
  color: var(--accent);
  background: var(--accent-soft);
}
.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 600;
}
.toc-link.h3 {
  padding-left: 22px;
}

/* 桌面侧栏 */
.toc-aside {
  position: sticky;
  top: calc(var(--nav-height) + 28px);
  width: 200px;
  flex-shrink: 0;
  padding: 4px 0;
}
.toc-aside .toc-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 移动折叠 */
.toc-mobile {
  display: none;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  background: var(--bg-surface);
}
.toc-mobile summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 14px;
}
.toc-mobile .toc-list {
  margin-top: 12px;
}

@media (max-width: 1024px) {
  .toc-aside {
    display: none;
  }
  .toc-mobile {
    display: block;
    order: -1;
    width: 100%;
  }
}
</style>
