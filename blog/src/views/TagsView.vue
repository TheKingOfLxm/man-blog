<script setup lang="ts">
import { useScrollReveal } from '../composables/useScrollReveal'
import { useSeo } from '../composables/useSeo'

useScrollReveal()

useSeo({
  title: '标签索引 - 小满的技术随笔',
  description: '按标签浏览全部文章。'
})
</script>

<template>
  <div class="tags-page">
    <div class="container">
      <section class="tags-header">
        <h1 class="reveal">标签索引</h1>
        <p class="subtitle reveal">按标签浏览全部文章（占位页，待后续完善）</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
  padding-top: calc(var(--nav-height) + 40px);
  padding-bottom: 80px;
  min-height: 100vh;
}
.tags-header {
  margin-bottom: 32px;
}
.tags-header h1 {
  font-family: var(--font-display);
  color: var(--ink);
}
.subtitle {
  color: var(--text-muted);
}
</style>
