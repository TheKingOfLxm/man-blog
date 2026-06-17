<script setup lang="ts">
import type { Post } from '../types'
defineProps<{ post: Post }>()
</script>

<template>
  <router-link :to="`/blog/${post.id}`" class="featured">
    <div class="feat-text">
      <span class="kicker">精选 · {{ post.category }}</span>
      <h2 class="feat-title">{{ post.title }}</h2>
      <p class="feat-dek">{{ post.summary }}</p>
      <div class="feat-meta">
        <span>{{ post.date }}</span>
        <span class="pill" v-if="post.readingTime">{{ post.readingTime }} 分钟阅读</span>
        <span class="tags">#{{ post.tags.join(' #') }}</span>
      </div>
      <span class="feat-cta">阅读全文 →</span>
    </div>
    <div class="feat-art" :aria-hidden="true">
      <span class="art-mark">{{ post.category }}.</span>
    </div>
  </router-link>
</template>

<style scoped>
.featured {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 36px;
  align-items: center;
  padding: 36px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
}
.feat-title {
  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.1;
  margin: 12px 0 14px;
  color: var(--ink);
  transition: color var(--transition-fast);
}
.featured:hover .feat-title { color: var(--accent); }
.feat-dek {
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-body);
  max-width: 42ch;
}
.feat-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-muted);
  flex-wrap: wrap;
}
.pill {
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
}
.tags { color: var(--accent); font-weight: 600; }
.feat-cta {
  display: inline-flex;
  margin-top: 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 3px;
}
.feat-art {
  height: 240px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--bg-surface-alt), var(--border));
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}
.feat-art::before {
  content: '{}';
  position: absolute;
  top: 16px; right: 20px;
  font-family: var(--font-mono);
  font-size: 64px;
  color: var(--accent-soft);
  font-weight: 700;
}
.art-mark {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 56px;
  color: var(--accent);
  opacity: 0.85;
  line-height: 0.9;
}
@media (max-width: 768px) {
  .featured { grid-template-columns: 1fr; gap: 22px; }
  .feat-art { height: 180px; order: -1; }
}
</style>
